import {
  Nonterminal,
  ParseRules,
  Rhs,
  Symbol,
  Terminal,
} from "@/packages/grammar";
import { Item } from "@/packages/parsing";
import { ComponentProps } from "react";
import { ForceGraph2D } from "react-force-graph";

type GraphData = ComponentProps<typeof ForceGraph2D>["graphData"];

interface Thing {
  lhs: Nonterminal;
  rhs: Rhs;
  positions: number[]; // first and last element is the parent
  //each of the elements in the positions array is a child that corresponds to the positions.

  // A -> A B C
  // 1345 => A 1 5 is parent
  // A 1 3, B 3 4, C 4 5 are children
}

interface SymbolEntry {
  start: number;
  end: number;
  symbol: Symbol;
}

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
      this.items.get(start).get(end).get(item).add(split);
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

  getThingParent(thing: Thing): SymbolEntry {
    return {
      start: thing.positions[0],
      end: thing.positions[thing.positions.length - 1],
      symbol: thing.lhs,
    };
  }

  getThingChildren(thing: Thing): SymbolEntry[] {
    const children = [];

    // It's minus 1 and less than (not equal) because we are getting pairs from first to last, and the total pairs is length - 1 (and i is the first element of the pair)
    for (let i = 0; i < thing.positions.length - 1; i++) {
      children.push({
        start: thing.positions[i],
        end: thing.positions[i + 1],
        symbol: thing.rhs.elements[i].symbol,
      });
    }

    return children;
  }

  generateThingPositions(
    start: number,
    end: number,
    item: Item
  ): Set<number[]> {
    let result = new Set<number[]>();

    Array.from(this.items.get(start).get(end).get(item), (split) => {
      if (split === undefined) {
        console.assert(start === end);
        console.assert(item.consumed === 0);
        result.add([start]);
      } else {
        const previous = Item.make(item.lhs, item.rhs, item.consumed - 1);
        const previousThings = this.generateThingPositions(
          start,
          split,
          previous
        );

        previousThings.forEach((thing) => {
          result.add([...thing, end]);
        });
      }
    });

    return result;
  }

  generateAllThings(start: number, end: number, item: Item): Set<Thing> {
    // For each result, pair the number list with the production of that item.
    const result = new Set<Thing>();

    const positions = this.generateThingPositions(start, end, item);

    positions.forEach((positionList) => {
      result.add({
        lhs: item.lhs,
        rhs: item.rhs,
        positions: positionList,
      });
    });

    return result;
  }

  generateThingChart(): AutoMap<
    number,
    AutoMap<number, AutoMap<Symbol, Set<Thing>>>
  > {
    // Go through the chart's items and look only at the items that are complete.
    // ie the consumed is equal to the length of the rhs
    // For each complete item, call generateAllThings(start, end, item)

    const result: AutoMap<
      number,
      AutoMap<number, AutoMap<Symbol, Set<Thing>>>
    > = new AutoMap(() => new AutoMap(() => new AutoMap(() => new Set())));

    this.items.forEach((endMap, start) => {
      endMap.forEach((itemMap, end) => {
        itemMap.forEach((split, item) => {
          if (item.consumed === item.rhs.elements.length) {
            // console.log("item", item, start, end);
            const things = this.generateAllThings(start, end, item);

            things.forEach((thing) => {
              result.get(start).get(end).get(item.lhs).add(thing);
            });
          }
        });
      });
    });

    return result;
  }

  generateGraphData() {
    const thingChart = this.generateThingChart();

    let nodes: {
      id: string;
      leafStart?: number;
      fy?: number;
      fx?: number;
    }[] = [];

    let links: {
      source: string;
      target: string;
    }[] = [];

    thingChart.forEach((rows) => {
      rows.forEach((cols) => {
        cols.forEach((things) => {
          things.forEach((thing) => {
            const parent = this.getThingParent(thing);
            const children = this.getThingChildren(thing);
            console.log("thing", thing, children);

            nodes.push({
              id: JSON.stringify(thing),
            });

            links.push({
              source: JSON.stringify(parent),
              target: JSON.stringify(thing),
            });

            children.forEach((child) => {
              links.push({
                source: JSON.stringify(thing),
                target: JSON.stringify(child),
              });
            });
          });
        });
      });
    });

    [...this.symbols.entries()].forEach(([start, rows]) => {
      [...rows.entries()].forEach(([end, symbols]) => {
        symbols.forEach((symbol) => {
          nodes.push({
            leafStart: symbol instanceof Terminal ? start : undefined,
            id: JSON.stringify({
              start,
              end,
              symbol,
            }),
          });
        });
      });
    });

    return { nodes, links };
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
