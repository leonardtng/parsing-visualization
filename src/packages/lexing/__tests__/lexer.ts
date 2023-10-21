import { LexRules, Terminal, TerminalRule } from "@/packages/grammar";
import { Token, lexer } from "@/packages/lexing";
import "@testing-library/jest-dom";

describe("Lexer Test Suite", () => {
  it("returns correct output", () => {
    const paragraph = " A B B  AA123  123.45  --";

    const whitespace = /\s+/dy;
    const terminalRules: TerminalRule[] = [
      { terminal: Terminal.make("A"), regex: /A/dy },
      { terminal: Terminal.make("B"), regex: /B B/dy },
      { terminal: Terminal.make("X"), regex: /[A-Z]+/dy },
      { terminal: Terminal.make("Y"), regex: /\d+(\.\d+)?/dy },
    ];

    const lexRules: LexRules = { whitespace, terminalRules };

    const { position, tokens } = lexer(lexRules, paragraph);

    const tokenString = tokens
      .map((token: Token) => token.terminal.name)
      .join("");

    expect(position).toBe(23);
    expect(tokenString).toBe("ABXYY");
  });

  it("returns correct output for square brackets", () => {
    const paragraph = "[()()]";

    const whitespace = /\s+/dy;
    const terminalRules: TerminalRule[] = [
      { terminal: Terminal.make("["), regex: /\[/dy },
      { terminal: Terminal.make("]"), regex: /\]/dy },
      { terminal: Terminal.make("("), regex: /\(/dy },
      { terminal: Terminal.make(")"), regex: /\)/dy },
    ];

    const lexRules: LexRules = { whitespace, terminalRules };

    const { position, tokens } = lexer(lexRules, paragraph);

    const tokenString = tokens
      .map((token: Token) => token.terminal.name)
      .join("");

    expect(position).toBe(6);
    expect(tokenString).toBe("[()()]");
  });

  it("passes prose test", () => {
    const paragraph =
      "The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?";
    const whitespace = /\s+/dy;
    const terminalRules: TerminalRule[] = [
      { terminal: Terminal.make("WORD"), regex: /\b\w+\b/dy },
      { terminal: Terminal.make("COMMA"), regex: /,/dy },
      { terminal: Terminal.make("PUNCTUATION"), regex: /\./dy },
      { terminal: Terminal.make("QUESTION_MARK"), regex: /\?/dy },
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
