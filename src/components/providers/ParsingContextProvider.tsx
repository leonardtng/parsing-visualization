import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Nonterminal, Symbol, Terminal, Token } from "@/packages";
import { GRAMMARS, ParsingContext } from "@/constants";
import { Grammar } from "@/types";
import { useParser } from "@/helpers/parsing";

interface Props {
  children?: ReactNode;
}

const ParsingContextProvider: FC<Props> = ({ children }: Props) => {
  const [grammar, setGrammar] = useState<Grammar>(GRAMMARS[0]);
  const [input, setInput] = useState<string>(
    GRAMMARS[0].data.defaultInput ?? ""
  );
  const grammarOptions = useMemo(() => GRAMMARS, []);
  const { chart, directory, tokens } = useParser(grammar, input);

  const onInputChange = (input: string) => {
    setInput(input);
  };

  const selectGrammar = (grammar: Grammar) => {
    setGrammar(grammar);
    onInputChange(grammar.data.defaultInput ?? "");
  };

  const mapKeys = useMemo(
    () => Object.keys(grammar.data.productionMap),
    [grammar.data.productionMap]
  );

  const getDisplayedNode = useCallback(
    (col: Symbol[] | null): string => {
      if (!col) return "";
      if (col.length === 1) return (col[0] as Terminal | Nonterminal).name;

      const names = col.map((cell) => (cell as Terminal | Nonterminal).name);

      for (const node of mapKeys) {
        if (names.includes(node)) {
          return node;
        }
      }

      return "";
    },
    [mapKeys]
  );

  const [showMostRelevant, setShowMostRelevant] = useState<boolean>(true);
  const toggleShowMostRelevant = () => {
    setShowMostRelevant((prev) => !prev);
  };

  const [mergeHighlights, setMergeHighlights] = useState<boolean>(true);
  const toggleMergeHighlights = () => {
    setMergeHighlights((prev) => !prev);
  };

  const [highlightedBlock, setHighlightedBlock] = useState<Token[]>([]);
  const handleHighlightedBlock = (block: Token[]) => {
    setHighlightedBlock(block);
  };

  const clearHighlightedBlock = () => {
    setHighlightedBlock([]);
  };

  return (
    <ParsingContext.Provider
      value={{
        input,
        onInputChange,
        grammar,
        selectGrammar,
        grammarOptions,
        chart,
        tokens,
        directory,
        getDisplayedNode,

        showMostRelevant,
        toggleShowMostRelevant,

        mergeHighlights,
        toggleMergeHighlights,

        highlightedBlock,
        handleHighlightedBlock,
        clearHighlightedBlock,
      }}
    >
      {children}
    </ParsingContext.Provider>
  );
};

export default ParsingContextProvider;
