import { Chart, Json, translator } from "@/packages/parsing";
import { Token, lexer } from "@/packages/lexing";
import { ParseRules } from "@/packages/grammar";

export const parser = (input: string, grammar: Json) => {
  const { parseRules, ...lexRules } = translator(grammar);
  const { position, tokens } = lexer(lexRules, input);

  return generateChart(tokens, parseRules);
};

export const generateChart = (tokens: Token[], parseRules: ParseRules) => {
  const chart = new Chart();
  chart.addSymbolList(tokens.map((token) => token.terminal));
  chart.addEpsilonItems(parseRules.productionMap);

  return chart;
};
