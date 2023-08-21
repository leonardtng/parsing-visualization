import { MatchResult, Terminal } from "@/packages/grammar";

export interface Token {
  terminal: Terminal;
  matchResult: MatchResult;
}
