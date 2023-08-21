import {
  Chart,
  Json,
  Nonterminal,
  ParseRules,
  Terminal,
  translator,
} from "@/packages";
import input from "./input/matching-pairs.json";
import "@testing-library/jest-dom";

describe("Chart Test Suite", () => {
  it("returns correct output for matching pairs", () => {
    const s = new Nonterminal("S");
    const a = new Nonterminal("A");
    const b = new Nonterminal("B");

    const parseRules: ParseRules = translator(
      input as unknown as Json
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
    let str = "";

    chart.symbols.forEach((endMap, start) => {
      endMap.forEach((symbols, end) => {
        symbols.forEach((symbol) => {
          str += `${start}, ${end}, ${
            (symbol as Terminal | Nonterminal).name
          }\n`;
        });
      });
    });

    console.log(str);
  });
});

// 0, 1, A
// 0, 0, S
// 0, 4, S
// 1, 2, A
// 1, 1, S
// 1, 3, S
// 2, 3, B
// 2, 2, S
// 3, 4, B
// 3, 3, S
// 4, 4, S
