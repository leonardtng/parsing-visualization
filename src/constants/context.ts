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
  directory: { [key: string]: string } | undefined;
  getDisplayedNode: (col: Symbol[] | null) => string;
  showMostRelevant: boolean;
  toggleShowMostRelevant: () => void;
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
  directory: undefined,
  getDisplayedNode: () => "",
  showMostRelevant: true,
  toggleShowMostRelevant: () => {},
});

export const useParsingContext = () => useContext(ParsingContext);
