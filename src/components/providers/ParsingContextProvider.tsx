import React, { FC, ReactNode, useCallback, useMemo, useState } from "react";
import { Nonterminal, Symbol, Terminal } from "@/packages";
import { GRAMMARS, ParsingContext } from "@/constants";
import { Grammar } from "@/types";
import { useParser } from "@/helpers/parsing";

interface Props {
  children?: ReactNode;
}

const ParsingContextProvider: FC<Props> = ({ children }: Props) => {
  const [input, setInput] = useState<string>("");
  const [grammar, setGrammar] = useState<Grammar>(GRAMMARS[0]);
  const grammarOptions = useMemo(() => GRAMMARS, []);
  const { chart, directory } = useParser(grammar, input);

  const onInputChange = (input: string) => {
    setInput(input);
  };

  const selectGrammar = (grammar: Grammar) => {
    setGrammar(grammar);
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

  return (
    <ParsingContext.Provider
      value={{
        input,
        onInputChange,
        grammar,
        selectGrammar,
        grammarOptions,
        chart,
        directory,
        getDisplayedNode,
        showMostRelevant,
        toggleShowMostRelevant,
      }}
    >
      {children}
    </ParsingContext.Provider>
  );
};

export default ParsingContextProvider;
