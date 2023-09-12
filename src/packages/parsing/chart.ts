import { Nonterminal, ParseRules, Symbol, Terminal } from "@/packages/grammar";
import { Item } from "@/packages/parsing";

export class AutoMap<K, V> extends Map<K, V> {
  makeDefaultValue: () => V;

  constructor(fn: () => V) {
    super();
    this.makeDefaultValue = fn;
  }

  get(key: K): V {
    if (!super.has(key)) {
      super.set(key, this.makeDefaultValue());
    }
    return super.get(key) as V;
  }
}

export const epsilonItems = (productionMap: ParseRules["productionMap"]) =>
  new Set(
    Array.from(productionMap).flatMap(([lhs, rhsSet]) =>
      Array.from(rhsSet).flatMap((rhs) => Item.make(lhs, rhs, 0))
    )
  );

export class Chart {
  symbols: AutoMap<number, AutoMap<number, Set<Symbol>>> = new AutoMap(
    () => new AutoMap(() => new Set())
  );
  items: AutoMap<
    number,
    AutoMap<number, AutoMap<Item, Set<number | undefined>>>
  > = new AutoMap(() => new AutoMap(() => new AutoMap(() => new Set())));
  symbolEnds: AutoMap<number, AutoMap<Symbol, Set<number>>> = new AutoMap(
    () => new AutoMap(() => new Set())
  );
  nextItems: AutoMap<number, AutoMap<Symbol, AutoMap<number, Set<Item>>>> =
    new AutoMap(() => new AutoMap(() => new AutoMap(() => new Set())));

  addSymbol(start: number, end: number, symbol: Symbol) {
    if (!this.symbols.get(start).get(end).has(symbol)) {
      this.symbols.get(start).get(end).add(symbol);
      this.symbolEnds.get(start).get(symbol).add(end);

      this.nextItems
        .get(start)
        .get(symbol)
        .forEach((nextItemSet, nextItemStart) => {
          nextItemSet.forEach((nextItem) => {
            this.addItem(nextItemStart, end, nextItem, start);
          });
        });
    }
  }

  addItem(start: number, end: number, item: Item, split: number | undefined) {
    if (!this.items.get(start).get(end).get(item).has(split)) {
      const consumed = item.consume();

      if (!consumed) {
        this.addSymbol(start, end, item.lhs);
      } else {
        const [consumedSymbol, nextItem] = consumed;
        this.nextItems.get(end).get(consumedSymbol).get(start).add(nextItem);

        this.symbolEnds
          .get(end)
          .get(consumedSymbol)
          .forEach((symbolEnd) => {
            this.addItem(start, symbolEnd, nextItem, end);
          });
      }
    }
  }

  addEpsilonItems(productionMap: ParseRules["productionMap"]) {
    const items = epsilonItems(productionMap);

    const positions: Set<number> = new Set();

    for (const [start, endMap] of this.symbols) {
      positions.add(start);
      for (var [end] of endMap) {
        positions.add(end);
      }
    }

    for (const [start, endMap] of this.items) {
      positions.add(start);

      for (var [end] of endMap) {
        positions.add(end);
      }
    }

    positions.forEach((position) => {
      items.forEach((item) => {
        this.addItem(position, position, item, undefined);
      });
    });
  }

  addSymbolList(symbolList: Symbol[], start: number = 0) {
    symbolList.forEach((symbol, index) => {
      this.addSymbol(start + index, start + index + 1, symbol);
    });
  }

  grid() {
    const grid: (Symbol[] | null)[][] = Array(this.symbols.size)
      .fill(null)
      .map(() =>
        Array(this.symbols.size)
          .fill(null)
          .map(() => [])
      );

    this.symbols.forEach((endMap, start) => {
      endMap.forEach((symbols, end) => {
        symbols.forEach((symbol) => {
          grid[start][end]!.push(symbol);
        });
      });
    });

    return grid;
  }

  print() {
    process.stdout.write("\n");
    let maxSize = 0;
    this.symbols.forEach((endMap) => {
      endMap.forEach((_, end) => {
        if (end > maxSize) {
          maxSize = end;
        }
      });
    });

    const grid = this.grid();

    for (let i = 0; i <= maxSize; i++) {
      for (let j = 0; j <= maxSize; j++) {
        const cell = grid[i][j];
        const cellValue =
          cell!.length > 0
            ? cell!.map((s) => (s as Terminal | Nonterminal).name).join(",")
            : " ";
        process.stdout.write(`| ${cellValue} `);
      }
      process.stdout.write("|\n");
      process.stdout.write("-".repeat((maxSize + 1) * 4 + 1));
      process.stdout.write("\n");
    }
  }
}
