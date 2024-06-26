import {
  Nonterminal,
  ParseRules,
  Rhs,
  Symbol,
  Terminal,
} from "@/packages/grammar";
import { Item } from "@/packages/parsing";
import { Token } from "@/packages/lexing";
import { Grammar } from "@/types";
import { shortenString } from "@/helpers";

export const HIGHLIGHT_PRIMARY_COLOR = "#ff6361";
export const HIGHLIGHT_SECONDARY_COLOR = "#ffa600";
export const HIGHLIGHT_TERTIARY_COLOR = "#488f31";
export const LINK_COLOR = "#353945";
export const TERMINAL_COLOR = "#2f4b7c";
export const PRODUCTION_ENTRY_COLOR = "#003f5c";
export const EPSILON_ITEM_COLOR = "#003f5c";
export const SYMBOL_COLOR = "#58508d";

export interface GraphNode {
  id: string;
  fy?: number;
  fx?: number;
  y?: number;
  x?: number;
  vy?: number;
  vx?: number;

  level?: number;
  leafStart?: number;
  color?: string;
  name?: (tokens: Token[]) => string;
  isSymbol?: boolean; // full node symbols
  isTerminal?: boolean; // terminal symbols (rooted at bottom of tree)
  isEpsilon?: boolean; // epsilon symbols (rooted at bottom of tree)

  hoverTooltip?: (grammar: Grammar, tokens: Token[]) => string[];
  children?: GraphNode[];
  parent?: GraphNode[];

  getStartEnd?: [number, number];
}

export interface GraphLink {
  source: string;
  target: string;
  grammarKey?: string;
}

interface ProductionEntry {
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

  getProductionEntryParent(productionEntry: ProductionEntry): SymbolEntry {
    return {
      start: productionEntry.positions[0],
      end: productionEntry.positions[productionEntry.positions.length - 1],
      symbol: productionEntry.lhs,
    };
  }

  getProductionEntryChildren(productionEntry: ProductionEntry): SymbolEntry[] {
    const children = [];

    // It's minus 1 and less than (not equal) because we are getting pairs from first to last, and the total pairs is length - 1 (and i is the first element of the pair)
    for (let i = 0; i < productionEntry.positions.length - 1; i++) {
      children.push({
        start: productionEntry.positions[i],
        end: productionEntry.positions[i + 1],
        symbol: productionEntry.rhs.elements[i].symbol,
      });
    }

    return children;
  }

  generateProductionEntryPositions(
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
        const previousProductionEntries = this.generateProductionEntryPositions(
          start,
          split,
          previous
        );

        previousProductionEntries.forEach((productionEntry) => {
          result.add([...productionEntry, end]);
        });
      }
    });

    return result;
  }

  generateAllProductionEntries(
    start: number,
    end: number,
    item: Item
  ): Set<ProductionEntry> {
    // For each result, pair the number list with the production of that item.
    const result = new Set<ProductionEntry>();

    const positions = this.generateProductionEntryPositions(start, end, item);

    positions.forEach((positionList) => {
      result.add({
        lhs: item.lhs,
        rhs: item.rhs,
        positions: positionList,
      });
    });

    return result;
  }

  generateProductionEntryChart(): AutoMap<
    number,
    AutoMap<number, AutoMap<Symbol, Set<ProductionEntry>>>
  > {
    // Go through the chart's items and look only at the items that are complete.
    // ie the consumed is equal to the length of the rhs
    // For each complete item, call generateAllProductionEntries(start, end, item)

    const result: AutoMap<
      number,
      AutoMap<number, AutoMap<Symbol, Set<ProductionEntry>>>
    > = new AutoMap(() => new AutoMap(() => new AutoMap(() => new Set())));

    this.items.forEach((endMap, start) => {
      endMap.forEach((itemMap, end) => {
        itemMap.forEach((split, item) => {
          if (item.consumed === item.rhs.elements.length) {
            // console.log("item", item, start, end);
            const productionEntries = this.generateAllProductionEntries(
              start,
              end,
              item
            );

            productionEntries.forEach((productionEntry) => {
              result.get(start).get(end).get(item.lhs).add(productionEntry);
            });
          }
        });
      });
    });

    return result;
  }

  generateGraphData() {
    const productionEntryChart = this.generateProductionEntryChart();

    let nodes: GraphNode[] = [];

    let links: GraphLink[] = [];

    productionEntryChart.forEach((rows) => {
      rows.forEach((cols) => {
        cols.forEach((productionEntries) => {
          productionEntries.forEach((productionEntry) => {
            const parent = this.getProductionEntryParent(productionEntry);
            const children = this.getProductionEntryChildren(productionEntry);

            if (
              productionEntry.positions[0] ===
              productionEntry.positions[productionEntry.positions.length - 1]
            ) {
              return;
            }

            nodes.push({
              id: JSON.stringify(productionEntry),
              isSymbol: false,
              color: PRODUCTION_ENTRY_COLOR,
              name: (tokens) => "Production Entry",
              hoverTooltip: (grammar: Grammar, tokens: Token[]) => [
                `${productionEntry.lhs.name} ➜ ${
                  productionEntry.rhs.elements
                    .map((e) => (e.symbol as Terminal | Nonterminal).name)
                    .join(" ") || '""'
                } [${productionEntry.positions.join(",")}]`,
              ],
            });

            links.push({
              source: JSON.stringify(parent),
              target: JSON.stringify(productionEntry),
            });

            children.forEach((child) => {
              links.push({
                source: JSON.stringify(productionEntry),
                target: JSON.stringify(child),
              });
            });
          });
        });
      });
    });

    // Actual Nodes
    [...this.symbols.entries()].forEach(([start, rows]) => {
      [...rows.entries()].forEach(([end, symbols]) => {
        symbols.forEach((symbol) => {
          const isSymbol = true;
          const isTerminal = symbol instanceof Terminal;
          const isEpsilon = start === end;

          nodes.push({
            name: (tokens: Token[]) => {
              if (!isTerminal) {
                return (symbol as Nonterminal).name;
              } else {
                const matchResult =
                  tokens[start]?.matchResult ?? (symbol as Terminal).name;

                return shortenString(matchResult[0]);
              }
            },
            leafStart:
              isTerminal || isEpsilon
                ? start + end // fix epsilon symbols in between symbols
                : undefined,
            isSymbol,
            isTerminal,
            isEpsilon,
            id: JSON.stringify({
              start,
              end,
              symbol,
            }),
            color: isTerminal
              ? TERMINAL_COLOR
              : isEpsilon
              ? EPSILON_ITEM_COLOR
              : SYMBOL_COLOR,
            hoverTooltip: (grammar: Grammar, tokens: Token[]) => {
              const tokenName =
                grammar.data.directory?.[
                  (symbol as Terminal | Nonterminal).name
                ] ?? "";

              const nodeTokens = tokens.slice(start, end);

              const [minStart, maxEnd] = nodeTokens.reduce(
                (acc, match) => {
                  const start = match.matchResult.indices[0][0];
                  const end = match.matchResult.indices[0][1];

                  if (start < acc[0]) {
                    acc[0] = start;
                  }

                  if (end > acc[1]) {
                    acc[1] = end;
                  }

                  return acc;
                },
                [Infinity, 0]
              );

              const codeBlock = nodeTokens?.[0]?.matchResult.input?.slice(
                minStart,
                maxEnd
              );

              return [`${tokenName}`, `${codeBlock}`];
            },
            getStartEnd: [start, end],
          });
        });
      });
    });

    const hasCycle = this.hasCycle(nodes, links);

    // Generate levels when no cycles in links
    if (!hasCycle) {
      nodes.forEach((node) => {
        this.getNodeLevel(node, nodes, links);
      });
    }

    return { nodes, links, hasCycle };
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

  // Graph utils
  getNodeChildren(node: GraphNode, nodes: GraphNode[], links: GraphLink[]) {
    const childrenIds = new Set(
      links
        .filter((link: GraphLink) => link.source === node.id)
        .map((link: GraphLink) => link.target)
    );

    return nodes.filter((node: GraphNode) => childrenIds.has(node.id));
  }

  getNodeParent(node: GraphNode, nodes: GraphNode[], links: GraphLink[]) {
    const parentIds = new Set(
      links
        .filter((link: GraphLink) => link.target === node.id)
        .map((link: GraphLink) => link.source)
    );

    return nodes.filter((node: GraphNode) => parentIds.has(node.id));
  }

  getNodeLevel(node: GraphNode, nodes: GraphNode[], links: GraphLink[]) {
    if (!node.level) {
      let maxLevel = 0;

      const children = this.getNodeChildren(node, nodes, links);

      children.forEach((node: GraphNode) => {
        maxLevel = Math.max(maxLevel, this.getNodeLevel(node, nodes, links));
      });

      // Add list of parents here
      node.parent = this.getNodeParent(node, nodes, links);

      node.children = children;
      node.level = maxLevel + 1;
    }
    return node.level;
  }

  hasCycle(nodes: GraphNode[], links: GraphLink[]) {
    function buildGraph(
      nodes: GraphNode[],
      links: GraphLink[]
    ): Map<string, string[]> {
      const graph = new Map<string, string[]>();

      nodes.forEach((node) => {
        graph.set(node.id, []); // Initialize each node with an empty array of connections
      });

      links.forEach((link) => {
        if (graph.has(link.source)) {
          graph.get(link.source)!.push(link.target);
        }
      });

      return graph;
    }

    function hasCycleUtil(
      node: string,
      graph: Map<string, string[]>,
      visited: Set<string>,
      recStack: Set<string>
    ): boolean {
      if (!visited.has(node)) {
        visited.add(node);
        recStack.add(node);

        const neighbors = graph.get(node) || [];
        for (const neighbor of neighbors) {
          if (
            !visited.has(neighbor) &&
            hasCycleUtil(neighbor, graph, visited, recStack)
          ) {
            return true;
          } else if (recStack.has(neighbor)) {
            return true;
          }
        }
      }

      recStack.delete(node);
      return false;
    }

    function hasCycle(nodes: GraphNode[], links: GraphLink[]): boolean {
      const graph = buildGraph(nodes, links);
      const visited = new Set<string>();
      const recStack = new Set<string>();

      for (const node of graph.keys()) {
        if (hasCycleUtil(node, graph, visited, recStack)) {
          return true;
        }
      }

      return false;
    }

    return hasCycle(nodes, links);
  }
}
