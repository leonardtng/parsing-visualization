import {
  Nonterminal,
  ParseRules,
  Rhs,
  RhsElement,
  Terminal,
  TerminalRule,
} from "@/packages/grammar";

export interface Json {
  start: string;
  productionMap: {
    [key: string]: [string, [string, string][] | string[]][];
  };
  whitespace: string;
  terminalRules: [string, string][];
  directory?: { [key: string]: string };
}

export interface TranslatorOutput {
  parseRules: ParseRules;
  whitespace: RegExp;
  terminalRules: TerminalRule[];
  directory?: { [key: string]: string };
}

export const translator = (json: Json): TranslatorOutput => {
  const terminals: Map<string, Terminal> = new Map();
  const nonterminals: Map<string, Nonterminal> = new Map();

  const whitespace = new RegExp(json.whitespace, "dy");
  const terminalRules: TerminalRule[] = json.terminalRules.map(
    (rule: [string, string]) => {
      const terminal = Terminal.make(rule[0]);
      terminals.set(rule[0], terminal);
      return {
        terminal,
        regex: new RegExp(rule[1], "dy"),
      };
    }
  );

  const start = Nonterminal.make(json.start);
  nonterminals.set(json.start, start);

  const productionMap: Map<Nonterminal, Set<Rhs>> = new Map();

  const parseElement = (element: any): RhsElement => {
    if (typeof element === "string") {
      return {
        label: undefined,
        symbol:
          terminals.get(element) ||
          nonterminals.get(element) ||
          Nonterminal.make(element),
      };
    } else if (Array.isArray(element)) {
      return {
        label: element[0],
        symbol: parseElement(element[1]).symbol,
      };
    }
    throw new Error("Unexpected element structure");
  };

  for (const [nonterminal, productions] of Object.entries(json.productionMap)) {
    const nonterm =
      nonterminals.get(nonterminal) || Nonterminal.make(nonterminal);
    nonterminals.set(nonterminal, nonterm);

    const rhsSet: Set<Rhs> = new Set();

    for (const production of productions) {
      const rhs: Rhs = {
        label: production[0],
        elements: production[1].map(parseElement),
      };
      rhsSet.add(rhs);
    }

    productionMap.set(nonterm, rhsSet);
  }

  return {
    parseRules: {
      start,
      productionMap,
    },
    whitespace,
    terminalRules,
    directory: json.directory,
  };
};
