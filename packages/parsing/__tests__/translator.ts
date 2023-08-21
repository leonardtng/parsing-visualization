import { Nonterminal, ParseRules } from "@/packages/grammar";
import { Json, translator } from "@/packages/parsing";
import input from "./input/matching-pairs.json";
import "@testing-library/jest-dom";

describe("Translator Test Suite", () => {
  it("returns correct output for matching pairs", () => {
    const s = new Nonterminal("S");
    const a = new Nonterminal("A");
    const b = new Nonterminal("B");

    const productionMapKeys = [s];

    const inputParseRules: ParseRules = translator(
      input as unknown as Json
    ).parseRules;

    const parseRules: ParseRules = {
      start: s,
      productionMap: new Map([
        [
          productionMapKeys[0],
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

    // Compare start
    expect(inputParseRules.start).toEqual(parseRules.start);

    // Compare productionMap
    expect(inputParseRules.productionMap.size).toEqual(
      parseRules.productionMap.size
    );

    const inputProductionMapKeys = inputParseRules.productionMap.keys();
    const inputProductionMapValues = inputParseRules.productionMap.values();

    productionMapKeys.forEach((expectedKey) => {
      // Check if key exists in inputParseRules and is the same as expectedKey
      const inputKey = inputProductionMapKeys.next().value;
      expect(inputKey).toEqual(expectedKey);

      // Get the expected value given the expected key
      const expectedValue = parseRules.productionMap.get(expectedKey);

      // Check if key exists in parseRules
      expect(expectedValue).toBeDefined();

      if (expectedValue) {
        // Convert the Set to Array for easier comparison
        const inputArray = Array.from(inputProductionMapValues.next().value);
        const expectedArray = Array.from(expectedValue);

        expect(inputArray).toEqual(expectedArray);
      }
    });
  });
});
