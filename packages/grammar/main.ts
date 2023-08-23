import { intern, intern2 } from "@/packages/utils";

export interface Symbol {}

export class Terminal implements Symbol {
  name: string;

  private constructor(name: string) {
    this.name = name;
  }

  static make = intern((name: string) => new Terminal(name));
}

export class Nonterminal implements Symbol {
  name: string;

  private constructor(name: string) {
    this.name = name;
  }

  static make = intern((name: string) => new Nonterminal(name));
}

export interface TerminalRule {
  terminal: Terminal;
  regex: RegExp;
}

export interface LexRules {
  whitespace: RegExp;
  terminalRules: TerminalRule[];
}

export type MatchResult = RegExpMatchArray & {
  indices: Array<[number, number]>;
};

// export interface RhsElement {
//   label: string | undefined;
//   symbol: Symbol;
// }

export class RhsElement {
  label: string | undefined;
  symbol: Symbol;

  private constructor(label: string | undefined, symbol: Symbol) {
    this.label = label;
    this.symbol = symbol;
  }

  static make = intern2(
    (label: string | undefined, symbol: Symbol) => new RhsElement(label, symbol)
  );
}

// export interface Rhs {
//   label: string | undefined;
//   elements: RhsElement[];
// }

export class Rhs {
  label: string | undefined;
  elements: RhsElement[];

  private constructor(label: string | undefined, elements: RhsElement[]) {
    this.label = label;
    this.elements = elements;
  }

  static make = intern2(
    (label: string | undefined, elements: RhsElement[]) =>
      new Rhs(label, elements)
  );
}

export interface ParseRules {
  start: Symbol;
  productionMap: Map<Nonterminal, Set<Rhs>>;
}
