import React, { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import {
  Chart,
  Nonterminal,
  Symbol,
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

  const debouncedParse = debounce(parse, 1000);

  useEffect(() => {
    debouncedParse();

    return () => debouncedParse.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grammar, input]);

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

export const useGetCellData = () => {
  const { directory, getDisplayedNode, showMostRelevant } = useParsingContext();
  const { gridSize } = useAnalyzeParse();

  const getCellData = (
    col: Symbol[] | null,
    rowIndex: number,
    colIndex: number
  ) => {
    if (showMostRelevant) {
      if (rowIndex === 0 && colIndex === gridSize - 1) {
        const cell = getDisplayedNode(col);

        return { cell, tooltip: directory?.[cell] };
      } else {
        const cell = (col?.[0] as Terminal | Nonterminal)?.name;

        return { cell, tooltip: directory?.[cell] };
      }
    } else {
      const cell = col?.map((cell) => (cell as Terminal | Nonterminal).name);
      return {
        cell: cell?.join(", "),
        tooltip: cell?.map((content) => directory?.[content]).join(", "),
      };
    }
  };

  return { getCellData };
};
