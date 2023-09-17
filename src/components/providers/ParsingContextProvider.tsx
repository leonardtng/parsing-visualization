import React, { FC, ReactNode, useMemo, useState } from "react";
import { ParsingContext } from "@/constants";
import { Grammar } from "@/types";
import { GRAMMARS } from "@/constants/grammar";
import { ParseRules } from "@/packages";

interface Props {
  children?: ReactNode;
}

const ParsingContextProvider: FC<Props> = ({ children }: Props) => {
  const [input, setInput] = useState<string>("");
  const [grammar, setGrammar] = useState<Grammar>(GRAMMARS[0]);
  const grammarOptions = useMemo(() => GRAMMARS, []);

  const onInputChange = (input: string) => {
    setInput(input);
  };

  const selectGrammar = (grammar: Grammar) => {
    setGrammar(grammar);
  };

  return (
    <ParsingContext.Provider
      value={{
        input,
        onInputChange,
        grammar,
        selectGrammar,
        grammarOptions,
      }}
    >
      {children}
    </ParsingContext.Provider>
  );
};

export default ParsingContextProvider;
