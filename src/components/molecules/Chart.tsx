import React, { useMemo } from "react";
import { useParsing } from "@/constants";
import { Nonterminal, Terminal } from "@/packages";

const Chart = () => {
  const { chart } = useParsing();

  const grid = useMemo(() => chart?.grid() ?? [], [chart]);
  const gridSize = grid.length ?? 0;

  const finalSymbol = gridSize > 0 ? grid[0][gridSize - 1] : [];
  const isComplete = finalSymbol?.length === 1;

  return (
    <div className="w-full h-[300px] overflow-auto">
      <div
        className="grid w-fit max-w-full"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {grid?.map((row, rowIndex) =>
          row.map((col, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-5 h-5 border 
              flex justify-center items-center text-sm
              ${
                rowIndex === 0 && colIndex === gridSize - 1
                  ? isComplete
                    ? "border-success"
                    : "border-error"
                  : "border-fontPrimary"
              }`}
            >
              {col?.map((cell, cellIndex) => (
                <span
                  key={cellIndex}
                  className={`${
                    isComplete && rowIndex === 0 && colIndex === gridSize - 1
                      ? "text-success"
                      : ""
                  }`}
                >
                  {(cell as Terminal | Nonterminal).name}
                </span>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Chart;
