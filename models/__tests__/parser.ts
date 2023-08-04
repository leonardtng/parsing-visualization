import { Chart, Nonterminal, ParseRules, Terminal } from "@/models";
import "@testing-library/jest-dom";

describe("Chart Test Suite", () => {
  it("returns correct output", () => {
    const s = new Nonterminal("S");
    const a = new Nonterminal("A");
    const b = new Nonterminal("B");

    const parseRules: ParseRules = {
      start: s,
      productionMap: new Map([
        [
          s,
          new Set([
            {
              label: "p",
              elements: [
                { label: undefined, symbol: a },
                { label: undefined, symbol: s },
                { label: undefined, symbol: b },
              ],
            },
            {
              label: "e",
              elements: [],
            },
          ]),
        ],
      ]),
    };

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
