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

    chart.print();
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
    const a = Terminal.make("A");
    const b = Terminal.make("B");

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

    chart.print();
    const expectedOutput = [
      "0, 1, A",
      "0, 3, S",
      "0, 0, S",
      "1, 2, S",
      "1, 1, S",
      "2, 3, B",
      "2, 2, S",
      "3, 3, S",
    ];

    results.sort();
    expectedOutput.sort();

    expect(results).toEqual(expectedOutput);
  });
});
