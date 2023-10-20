import { createContext, useContext } from "react";
import { Chart, Json, Symbol } from "@/packages";
import { Grammar, GrammarKey } from "@/types";

export interface ParsingContext {
  input: string;
  onInputChange: (input: string) => void;
  grammar: Grammar;
  selectGrammar: (grammar: Grammar) => void;
  grammarOptions: Grammar[];
  chart: Chart | null;
  getDisplayedNode: (col: Symbol[] | null) => string;
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
  getDisplayedNode: () => "",
});

export const useParsing = () => useContext(ParsingContext);
