import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import debounce from "lodash/debounce";
import { Chart, parser } from "@/packages";
import { GRAMMARS, ParsingContext } from "@/constants";
import { Grammar } from "@/types";

interface Props {
  children?: ReactNode;
}

const ParsingContextProvider: FC<Props> = ({ children }: Props) => {
  const [input, setInput] = useState<string>("");
  const [grammar, setGrammar] = useState<Grammar>(GRAMMARS[0]);
  const grammarOptions = useMemo(() => GRAMMARS, []);
  const [chart, setChart] = useState<Chart | null>(null);

  const onInputChange = (input: string) => {
    setInput(input);
  };

  const selectGrammar = (grammar: Grammar) => {
    setGrammar(grammar);
  };

  const parse = useCallback(() => {
    if (input && grammar) {
      const chart = parser(input, grammar.data);
      setChart(chart);
    } else {
      setChart(null);
    }
  }, [grammar, input]);

  const debouncedParse = useMemo(() => debounce(parse, 500), [parse]);

  useEffect(() => {
    debouncedParse();
  }, [debouncedParse]);

  return (
    <ParsingContext.Provider
      value={{
        input,
        onInputChange,
        grammar,
        selectGrammar,
        grammarOptions,
        chart,
      }}
    >
      {children}
    </ParsingContext.Provider>
  );
};

export default ParsingContextProvider;
