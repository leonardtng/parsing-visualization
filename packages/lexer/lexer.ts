import { LexRules, MatchResult, Token } from "@/models";

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
    let match = whitespace.exec(str) as MatchResult | null;

    if (match) position = match.indices[0][1];

    const token = terminalRules
      .map((rule) => {
        rule.regex.lastIndex = position;
        const match = rule.regex.exec(str) as MatchResult | null;
        return match ? new Token(rule.terminal, match) : null;
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
