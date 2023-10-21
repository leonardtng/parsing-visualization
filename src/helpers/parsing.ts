import React, { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { Chart, generateChart, lexer, translator } from "@/packages";
import { Grammar } from "@/types";

export const useParser = (grammar: Grammar, input: string) => {
  const [chart, setChart] = useState<Chart | null>(null);

  const { parseRules, directory, ...lexRules } = useMemo(
    () => translator(grammar.data),
    [grammar.data]
  );

  const { tokens } = useMemo(() => lexer(lexRules, input), [input, lexRules]);

  const parse = useCallback(() => {
    if (tokens.length > 0) {
      const chart = generateChart(tokens, parseRules);
      setChart(chart);
    } else {
      setChart(null);
    }
  }, [parseRules, tokens]);

  const debouncedParse = useMemo(() => debounce(parse, 1000), [parse]);

  useEffect(() => {
    debouncedParse();

    return () => debouncedParse.cancel();
  }, [debouncedParse]);

  return { chart, directory };
};
