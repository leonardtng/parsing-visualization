import { Nonterminal, Terminal } from "@/packages/grammar";
import { Json, parser } from "@/packages/parsing";
import matchingPairs from "./input/matching-pairs.json";
import "@testing-library/jest-dom";

describe("Parser Test Suite", () => {
  it("returns correct output for matching pairs", () => {
    const chart = parser("AABB", matchingPairs as unknown as Json);

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
});
