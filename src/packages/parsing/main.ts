import { Chart, Json, translator } from "@/packages/parsing";
import { lexer } from "..";

export const parser = (input: string, grammar: Json) => {
  const { parseRules, ...lexRules } = translator(grammar);

  const { position, tokens } = lexer(lexRules, input);

  const chart = new Chart();
  chart.addSymbolList(tokens.map((token) => token.terminal));
  chart.addEpsilonItems(parseRules.productionMap);

  return chart;
};
