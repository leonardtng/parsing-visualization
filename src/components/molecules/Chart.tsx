import React from "react";
import { motion } from "framer-motion";
import { useParsingContext } from "@/constants";
import { Nonterminal, Terminal } from "@/packages";
import { useTieredEffect, useWindowSize } from "@/helpers";
import { useAnalyzeParse } from "@/helpers/parsing";

const Chart = () => {
  const [winWidth, winHeight] = useWindowSize();
  const { getDisplayedNode, showMostRelevant } = useParsingContext();
  const { isComplete, grid, gridSize } = useAnalyzeParse();
  const { shadowStyles } = useTieredEffect();

  return (
    <div className="w-full h-full overflow-auto flex justify-center z-0">
      <div
        className="grid w-fit max-w-full h-fit z-10"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {grid?.map((row, rowIndex) =>
          row.map((col, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`${
                showMostRelevant ? "w-10" : "w-16"
              } aspect-square border 
              flex justify-center items-center text-[11px]
              ${
                rowIndex === 0 && colIndex === gridSize - 1
                  ? isComplete
                    ? "border-success text-success"
                    : "border-error text-error"
                  : "border-fontPrimary"
              } break-words overflow-auto no-scrollbar`}
            >
              {showMostRelevant
                ? rowIndex === 0 && colIndex === gridSize - 1
                  ? getDisplayedNode(col)
                  : (col?.[0] as Terminal | Nonterminal)?.name
                : col
                    ?.map((cell) => (cell as Terminal | Nonterminal).name)
                    .join(", ")}
            </div>
          ))
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="fixed rounded-full bg-background z-0"
        style={{
          top: winHeight + 60,
          width: winWidth,
          height: winWidth,
          ...shadowStyles,
        }}
      />
    </div>
  );
};

export default Chart;
