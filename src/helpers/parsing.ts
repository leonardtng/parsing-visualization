import React, { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import {
  Chart,
  Nonterminal,
  Terminal,
  generateChart,
  lexer,
  translator,
} from "@/packages";
import { Grammar } from "@/types";
import { useParsingContext } from "@/constants";

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

export const useAnalyzeParse = () => {
  const { grammar, chart } = useParsingContext();
  const grid = useMemo(() => chart?.grid() ?? [], [chart]);
  const gridSize = grid.length ?? 0;

  const finalSymbol = gridSize > 0 ? grid[0][gridSize - 1] : [];
  const isComplete = Boolean(
    finalSymbol &&
      finalSymbol.length >= 1 &&
      finalSymbol
        .map((cell) => (cell as Terminal | Nonterminal).name)
        .includes(grammar.data.start)
  );

  return { isComplete, grid, gridSize };
};
