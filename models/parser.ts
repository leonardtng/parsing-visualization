import { Nonterminal, Symbol } from "@/models";

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

export interface RhsElement {
  label: string | undefined;
  symbol: Symbol;
}

export interface Rhs {
  label: string | undefined;
  elements: RhsElement[];
}

export interface ParseRules {
  start: Symbol;
  productionMap: Map<Nonterminal, Set<Rhs>>;
}

export interface Item {
  lhs: Nonterminal;
  rhs: Rhs;
  consumed: number;
}

export const consume = (item: Item): [Symbol, Item] | null => {
  const { lhs, rhs, consumed } = item;

  if (consumed >= rhs.elements.length) return null;

  return [
    rhs.elements[consumed].symbol,
    {
      lhs,
      rhs,
      consumed: consumed + 1,
    },
  ];
};

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
      const consumed = consume(item);

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

  addEpsilonItem(position: number, productionMap: ParseRules["productionMap"]) {
    productionMap.forEach((rhsSet, lhs) => {
      rhsSet.forEach((rhs) => {
        this.addItem(position, position, { lhs, rhs, consumed: 0 }, undefined);
      });
    });
  }

  addEpsilonItems(productionMap: ParseRules["productionMap"]) {
    this.nextItems.forEach((_, position) => {
      this.addEpsilonItem(position, productionMap);
    });

    this.symbolEnds.forEach((_, position) => {
      this.addEpsilonItem(position, productionMap);
    });
  }

  addSymbolList(symbolList: Symbol[], start: number = 0) {
    symbolList.forEach((symbol, index) => {
      this.addSymbol(start + index, start + index + 1, symbol);
    });
  }
}
