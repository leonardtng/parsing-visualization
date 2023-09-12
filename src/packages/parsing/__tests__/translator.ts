import { Nonterminal, ParseRules, Terminal } from "@/packages/grammar";
import { Json, translator } from "@/packages/parsing";
import matchingPairs from "./input/matching-pairs.json";
import wellFormedParentheses from "./input/well-formed-parentheses.json";
import squareBrackets from "./input/square-brackets.json";
import "@testing-library/jest-dom";

describe("Translator Test Suite", () => {
  const checkInput = (
    input: ParseRules,
    expected: ParseRules,
    productionMapKeys: Nonterminal[]
  ) => {
    // Compare start
    expect(input.start).toEqual(expected.start);

    // Compare productionMap
    expect(input.productionMap.size).toEqual(expected.productionMap.size);

    const inputProductionMapKeys = input.productionMap.keys();
    const inputProductionMapValues = input.productionMap.values();

    productionMapKeys.forEach((expectedKey) => {
      // Check if key exists in inputParseRules and is the same as expectedKey
      const inputKey = inputProductionMapKeys.next().value;
      expect(inputKey).toEqual(expectedKey);

      // Get the expected value given the expected key
      const expectedValue = expected.productionMap.get(expectedKey);

      // Check if key exists in parseRules
      expect(expectedValue).toBeDefined();

      if (expectedValue) {
        // Convert the Set to Array for easier comparison
        const inputArray = Array.from(inputProductionMapValues.next().value);
        const expectedArray = Array.from(expectedValue);

        expect(inputArray).toEqual(expectedArray);
      }
    });
  };

  it("returns correct output for matching pairs", () => {
    const s = Nonterminal.make("S");
    const a = Terminal.make("A");
    const b = Terminal.make("B");

    const productionMapKeys = [s];

    const inputParseRules: ParseRules = translator(
      matchingPairs as unknown as Json
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

    checkInput(inputParseRules, parseRules, productionMapKeys);
  });

  it("returns correct output for well-formed parentheses", () => {
    const s = Nonterminal.make("S");
    const a = Terminal.make("(");
    const b = Terminal.make(")");

    const productionMapKeys = [s];

    const inputParseRules: ParseRules = translator(
      wellFormedParentheses as unknown as Json
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
                { label: undefined, symbol: s },
                { label: undefined, symbol: s },
              ],
            },
            {
              label: "q",
              elements: [
                { label: undefined, symbol: a },
                { label: undefined, symbol: s },
                { label: undefined, symbol: b },
              ],
            },
            {
              label: "r",
              elements: [
                { label: undefined, symbol: a },
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

    checkInput(inputParseRules, parseRules, productionMapKeys);
  });

  it("returns correct output for square parentheses", () => {
    const s = Nonterminal.make("S");
    const a = Terminal.make("(");
    const b = Terminal.make(")");
    const c = Terminal.make("[");
    const d = Terminal.make("]");

    const productionMapKeys = [s];

    const inputParseRules: ParseRules = translator(
      squareBrackets as unknown as Json
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
                { label: undefined, symbol: s },
                { label: undefined, symbol: s },
              ],
            },
            {
              label: "q",
              elements: [
                { label: undefined, symbol: a },
                { label: undefined, symbol: s },
                { label: undefined, symbol: b },
              ],
            },
            {
              label: "r",
              elements: [
                { label: undefined, symbol: a },
                { label: undefined, symbol: b },
              ],
            },
            {
              label: "s",
              elements: [
                { label: undefined, symbol: c },
                { label: undefined, symbol: s },
                { label: undefined, symbol: d },
              ],
            },
            {
              label: "t",
              elements: [
                { label: undefined, symbol: c },
                { label: undefined, symbol: d },
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

    checkInput(inputParseRules, parseRules, productionMapKeys);
  });
});
