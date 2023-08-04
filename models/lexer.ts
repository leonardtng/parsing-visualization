export interface Symbol {}

export class Terminal implements Symbol {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class Nonterminal implements Symbol {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
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

export interface Token {
  terminal: Terminal;
  matchResult: MatchResult;
}
