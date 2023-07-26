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

export class TerminalRule {
  terminal: Terminal;
  regex: RegExp;

  constructor(terminal: Terminal, regex: RegExp) {
    this.terminal = terminal;
    this.regex = regex;
  }
}

export class LexRules {
  whitespace: RegExp;
  terminalRules: TerminalRule[];

  constructor(whitespace: RegExp, terminalRules: TerminalRule[]) {
    this.whitespace = whitespace;
    this.terminalRules = terminalRules;
  }
}

export type MatchResult = RegExpMatchArray & {
  indices: Array<[number, number]>;
};

export class Token {
  terminal: Terminal;
  matchResult: MatchResult;

  constructor(terminal: Terminal, matchResult: MatchResult) {
    this.terminal = terminal;
    this.matchResult = matchResult;
  }
}
