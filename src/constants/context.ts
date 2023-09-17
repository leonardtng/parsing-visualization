import { Chart, Json } from "@/packages";
import { Grammar, GrammarKey } from "@/types";
import { createContext, useContext } from "react";

export interface ParsingContext {
  input: string;
  onInputChange: (input: string) => void;
  grammar: Grammar;
  selectGrammar: (grammar: Grammar) => void;
  grammarOptions: Grammar[];
  chart: Chart | null;
}

export const ParsingContext = createContext<ParsingContext>({
  input: "",
  onInputChange: () => {},
  grammar: {
    key: GrammarKey.SQUARE_BRACKETS,
    label: "",
    data: {} as unknown as Json,
  },
  selectGrammar: () => {},
  grammarOptions: [],
  chart: null,
});

export const useParsing = () => useContext(ParsingContext);
