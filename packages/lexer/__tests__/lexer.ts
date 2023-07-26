import { lexer } from "@/packages";
import { LexRules, Terminal, TerminalRule, Token } from "@/models";
import "@testing-library/jest-dom";

describe("Lexer Test Suite", () => {
  it("returns correct output", () => {
    const paragraph = " A B B  AA123  123.45  --";

    const whitespace = /\s+/dy;
    const terminalRules = [
      new TerminalRule(new Terminal("A"), /A/dy),
      new TerminalRule(new Terminal("B"), /B B/dy),
      new TerminalRule(new Terminal("X"), /[A-Z]+/dy),
      new TerminalRule(new Terminal("Y"), /\d+(\.\d+)?/dy),
    ];

    const lexRules = new LexRules(whitespace, terminalRules);

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
    const terminalRules = [
      new TerminalRule(new Terminal("WORD"), /\b\w+\b/dy),
      new TerminalRule(new Terminal("COMMA"), /,/dy),
      new TerminalRule(new Terminal("PUNCTUATION"), /\./dy),
      new TerminalRule(new Terminal("QUESTION_MARK"), /\?/dy),
    ];

    const lexRules = new LexRules(whitespace, terminalRules);

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
