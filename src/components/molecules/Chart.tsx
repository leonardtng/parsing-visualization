import React, { useMemo } from "react";
import { useParsing } from "@/constants";
import { Nonterminal, Terminal } from "@/packages";

const Chart = () => {
  const { grammar, chart, getDisplayedNode } = useParsing();

  const grid = useMemo(() => chart?.grid() ?? [], [chart]);
  const gridSize = grid.length ?? 0;

  const finalSymbol = gridSize > 0 ? grid[0][gridSize - 1] : [];
  const isComplete =
    finalSymbol &&
    finalSymbol.length >= 1 &&
    finalSymbol
      .map((cell) => (cell as Terminal | Nonterminal).name)
      .includes(grammar.data.start);

  return (
    <div className="w-full h-full overflow-auto flex justify-center">
      <div
        className="grid w-fit max-w-full h-fit"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {grid?.map((row, rowIndex) =>
          row.map((col, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-10 aspect-square border 
              flex justify-center items-center text-[11px]
              ${
                rowIndex === 0 && colIndex === gridSize - 1
                  ? isComplete
                    ? "border-success text-success"
                    : "border-error text-error"
                  : "border-fontPrimary"
              } break-words overflow-auto no-scrollbar`}
            >
              {rowIndex === 0 && colIndex === gridSize - 1
                ? getDisplayedNode(col)
                : (col?.[0] as Terminal | Nonterminal)?.name}
              {/* {col
                ?.map((cell) => (cell as Terminal | Nonterminal).name)
                .join(", ")} */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Chart;
