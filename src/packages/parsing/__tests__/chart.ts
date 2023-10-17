import {
  Chart,
  Json,
  Nonterminal,
  ParseRules,
  Terminal,
  translator,
} from "@/packages";
import matchingPairs from "./input/matching-pairs.json";
import wellFormedParentheses from "./input/well-formed-parentheses.json";
import squareBrackets from "./input/square-brackets.json";
import "@testing-library/jest-dom";

describe("Chart Test Suite", () => {
  it("returns correct output for matching pairs", () => {
    const s = Nonterminal.make("S");
    const a = Terminal.make("A");
    const b = Terminal.make("B");

    const parseRules: ParseRules = translator(
      matchingPairs as unknown as Json
    ).parseRules;

    // const parseRules: ParseRules = {
    //   start: s,
    //   productionMap: new Map([
    //     [
    //       s,
    //       new Set([
    //         {
    //           label: "p",
    //           elements: [
    //             { label: undefined, symbol: a },
    //             { label: undefined, symbol: s },
    //             { label: undefined, symbol: b },
    //           ],
    //         },
    //         {
    //           label: "e",
    //           elements: [],
    //         },
    //       ]),
    //     ],
    //   ]),
    // };

    const chart = new Chart();

    chart.addSymbolList([a, a, b, b]);
    chart.addEpsilonItems(parseRules.productionMap);
    let results: string[] = [];

    chart.symbols.forEach((endMap, start) => {
      endMap.forEach((symbols, end) => {
        symbols.forEach((symbol) => {
          results.push(
            `${start}, ${end}, ${(symbol as Terminal | Nonterminal).name}`
          );
        });
      });
    });

    // chart.print();
    const expectedOutput = [
      "0, 1, A",
      "0, 0, S",
      "0, 4, S",
      "1, 2, A",
      "1, 1, S",
      "1, 3, S",
      "2, 3, B",
      "2, 2, S",
      "3, 4, B",
      "3, 3, S",
      "4, 4, S",
    ];

    results.sort();
    expectedOutput.sort();

    expect(results).toEqual(expectedOutput);
  });

  it("returns correct output for well-formed parentheses", () => {
    const s = Nonterminal.make("S");
    const a = Terminal.make("(");
    const b = Terminal.make(")");

    const parseRules: ParseRules = translator(
      wellFormedParentheses as unknown as Json
    ).parseRules;

    // const parseRules: ParseRules = {
    //   start: s,
    //   productionMap: new Map([
    //     [
    //       s,
    //       new Set([
    //         {
    //           label: "p",
    //           elements: [
    //             { label: undefined, symbol: s },
    //             { label: undefined, symbol: s },
    //           ],
    //         },
    //         {
    //           label: "q",
    //           elements: [
    //             { label: undefined, symbol: a },
    //             { label: undefined, symbol: s },
    //             { label: undefined, symbol: b },
    //           ],
    //         },
    //         {
    //           label: "r",
    //           elements: [
    //             { label: undefined, symbol: a },
    //             { label: undefined, symbol: b },
    //           ],
    //         },
    //         {
    //           label: "e",
    //           elements: [],
    //         },
    //       ]),
    //     ],
    //   ]),
    // };

    const chart = new Chart();

    chart.addSymbolList([a, s, b]);
    chart.addEpsilonItems(parseRules.productionMap);
    let results: string[] = [];

    chart.symbols.forEach((endMap, start) => {
      endMap.forEach((symbols, end) => {
        symbols.forEach((symbol) => {
          results.push(
            `${start}, ${end}, ${(symbol as Terminal | Nonterminal).name}`
          );
        });
      });
    });

    // chart.print();
    const expectedOutput = [
      "0, 1, (",
      "0, 3, S",
      "0, 0, S",
      "1, 2, S",
      "1, 1, S",
      "2, 3, )",
      "2, 2, S",
      "3, 3, S",
    ];

    results.sort();
    expectedOutput.sort();

    expect(results).toEqual(expectedOutput);
  });

  it("returns correct output for square parentheses", () => {
    const s = Nonterminal.make("S");
    const a = Terminal.make("(");
    const b = Terminal.make(")");
    const c = Terminal.make("[");
    const d = Terminal.make("]");

    const parseRules: ParseRules = translator(
      squareBrackets as unknown as Json
    ).parseRules;

    const chart = new Chart();

    chart.addSymbolList([
      a,
      c,
      c,
      c,
      a,
      b,
      a,
      b,
      c,
      d,
      c,
      d,
      d,
      d,
      a,
      c,
      d,
      b,
      d,
      b,
    ]);
    chart.addEpsilonItems(parseRules.productionMap);
    let results: string[] = [];

    chart.symbols.forEach((endMap, start) => {
      endMap.forEach((symbols, end) => {
        symbols.forEach((symbol) => {
          results.push(
            `${start}, ${end}, ${(symbol as Terminal | Nonterminal).name}`
          );
        });
      });
    });

    // chart.print();

    const expectedOutput = [
      "0, 1, (",
      "0, 0, S",
      "0, 20, S",
      "1, 2, [",
      "1, 1, S",
      "1, 19, S",
      "2, 3, [",
      "2, 2, S",
      "2, 14, S",
      "2, 18, S",
      "3, 4, [",
      "3, 3, S",
      "3, 13, S",
      "4, 5, (",
      "4, 6, S",
      "4, 4, S",
      "4, 8, S",
      "4, 10, S",
      "4, 12, S",
      "5, 6, )",
      "5, 5, S",
      "6, 7, (",
      "6, 8, S",
      "6, 6, S",
      "6, 10, S",
      "6, 12, S",
      "7, 8, )",
      "7, 7, S",
      "8, 9, [",
      "8, 10, S",
      "8, 8, S",
      "8, 12, S",
      "9, 10, ]",
      "9, 9, S",
      "10, 11, [",
      "10, 12, S",
      "10, 10, S",
      "11, 12, ]",
      "11, 11, S",
      "12, 13, ]",
      "12, 12, S",
      "13, 14, ]",
      "13, 13, S",
      "14, 15, (",
      "14, 14, S",
      "14, 18, S",
      "15, 16, [",
      "15, 17, S",
      "15, 15, S",
      "16, 17, ]",
      "16, 16, S",
      "17, 18, )",
      "17, 17, S",
      "18, 19, ]",
      "18, 18, S",
      "19, 20, )",
      "19, 19, S",
      "20, 20, S",
    ];

    results.sort();
    expectedOutput.sort();

    expect(results).toEqual(expectedOutput);
  });
});
