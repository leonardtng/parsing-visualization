import { LexRules, Terminal, TerminalRule } from "@/packages/grammar";
import { Token, lexer } from "@/packages/lexing";
import "@testing-library/jest-dom";

describe("Lexer Test Suite", () => {
  it("returns correct output", () => {
    const paragraph = " A B B  AA123  123.45  --";

    const whitespace = /\s+/dy;
    const terminalRules: TerminalRule[] = [
      { terminal: new Terminal("A"), regex: /A/dy },
      { terminal: new Terminal("B"), regex: /B B/dy },
      { terminal: new Terminal("X"), regex: /[A-Z]+/dy },
      { terminal: new Terminal("Y"), regex: /\d+(\.\d+)?/dy },
    ];

    const lexRules: LexRules = { whitespace, terminalRules };

    const { position, tokens } = lexer(lexRules, paragraph);

    const tokenString = tokens
      .map((token: Token) => token.terminal.name)
      .join("");

    expect(position).toBe(23);
    expect(tokenString).toBe("ABXYY");
  });

  it("passes prose test", () => {
    const paragraph =
      "The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?";
    const whitespace = /\s+/dy;
    const terminalRules: TerminalRule[] = [
      { terminal: new Terminal("WORD"), regex: /\b\w+\b/dy },
      { terminal: new Terminal("COMMA"), regex: /,/dy },
      { terminal: new Terminal("PUNCTUATION"), regex: /\./dy },
      { terminal: new Terminal("QUESTION_MARK"), regex: /\?/dy },
    ];

    const lexRules: LexRules = { whitespace, terminalRules };

    const { position, tokens } = lexer(lexRules, paragraph);

    const tokenString = tokens.map((token: Token) => token.terminal.name);

    expect(position).toBe(paragraph.length);
    expect(tokenString).toStrictEqual([
      "WORD",
      "WORD",
      "WORD",
      "WORD",
      "WORD",
      "WORD",
      "WORD",
      "WORD",
      "WORD",
      "PUNCTUATION",
      "WORD",
      "WORD",
      "WORD",
      "WORD",
      "COMMA",
      "WORD",
      "WORD",
      "WORD",
      "WORD",
      "QUESTION_MARK",
    ]);
  });
});
