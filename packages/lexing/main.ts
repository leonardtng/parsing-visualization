import { LexRules, MatchResult } from "@/packages/grammar";
import { Token } from "@/packages/lexing";

type Lexer = (
  lexRules: LexRules,
  str: string
) => {
  position: number;
  tokens: Token[];
};

export const lexer: Lexer = (lexRules: LexRules, str: string) => {
  const { whitespace, terminalRules } = lexRules;
  const tokens: Token[] = [];
  let position: number = 0;

  while (true) {
    whitespace.lastIndex = position;
    let whitespaceMatchResult = whitespace.exec(str) as MatchResult | null;

    if (whitespaceMatchResult) position = whitespaceMatchResult.indices[0][1];

    const token: Token | null = terminalRules
      .map((rule) => {
        rule.regex.lastIndex = position;
        const matchResult = rule.regex.exec(str) as MatchResult | null;
        return matchResult ? { terminal: rule.terminal, matchResult } : null;
      })
      .reduce((acc: Token | null, curr: Token | null) => {
        if (!acc) return curr;
        if (!curr) return acc;

        if (curr.matchResult.indices[0][1] > acc.matchResult.indices[0][1]) {
          return curr;
        } else {
          return acc;
        }
      }, null);

    if (!token) break;

    tokens.push(token);
    position = token.matchResult.indices[0][1];
  }

  return {
    position,
    tokens,
  };
};
