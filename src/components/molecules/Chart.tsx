import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "@/components";
import { useParsingContext } from "@/constants";
import {
  useAnalyzeParse,
  useGetCellData,
  useScrollShadow,
  useTieredEffect,
  useWindowSize,
} from "@/helpers";

interface Props {
  isRendered?: boolean;
}

const Chart: FC<Props> = ({ isRendered = true }: Props) => {
  const [winWidth, winHeight] = useWindowSize();
  const { chart, showMostRelevant } = useParsingContext();
  const { isComplete, grid, gridSize } = useAnalyzeParse();
  const { shadowStyles } = useTieredEffect();
  const gridRef = useRef<HTMLDivElement>(null);
  const {
    scrollContainerProps,
    displayShadowStartY,
    displayShadowEndY,
    displayShadowStartX,
    displayShadowEndX,
  } = useScrollShadow({ deps: [gridRef] });
  const { getCellData } = useGetCellData();

  // console.log("BEFORE");
  // if (chart) {
  //   [...chart.items.entries()].forEach(([rowNumber, rows]) => {
  //     [...rows.entries()].forEach(([colNumber, cols]) => {
  //       [...cols.entries()].forEach(([item, prevPositionSet]) => {
  //         if (item.consumed > 0)
  //           console.log(item, rowNumber, colNumber, prevPositionSet);
  //         if (prevPositionSet.size > 0) {
  //           console.log("item", prevPositionSet);
  //         }
  //       });
  //     });
  //   });
  // }

  return (
    <div
      className={`relative w-full h-full overflow-hidden z-0 ${
        isRendered ? "" : "hidden"
      }`}
    >
      {displayShadowStartY && (
        <div className="absolute w-full flex justify-center top-0 left-0 z-20 pointer-events-none">
          <div
            className="max-w-full h-10 md:h-20"
            style={{
              width: gridRef.current ? gridRef.current.scrollWidth : "100%",
              background:
                "linear-gradient(0deg, rgba(18, 18, 18, 0) 0%, rgba(18, 18, 18, 0.8) 100%)",
            }}
          />
        </div>
      )}

      {displayShadowStartX && (
        <div className="absolute h-full flex items-center top-0 left-0 z-20 pointer-events-none">
          <div
            className="max-h-full w-10 md:w-20"
            style={{
              height: gridRef.current ? gridRef.current.scrollHeight : "100%",
              background:
                "linear-gradient(270deg, rgba(18, 18, 18, 0) 0%, rgba(18, 18, 18, 0.8) 100%)",
            }}
          />
        </div>
      )}

      <div
        {...scrollContainerProps}
        className={`w-full h-full overflow-auto flex z-0 p-3 ${
          gridRef.current && gridRef.current.scrollWidth > winWidth
            ? "justify-start"
            : "justify-center md:justify-start"
        }`}
      >
        <div
          ref={gridRef}
          className="grid w-fit h-fit z-10"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          }}
        >
          {grid?.map((row, rowIndex) =>
            row.map((col, colIndex) => {
              const { cell, tooltip } = getCellData(col, rowIndex, colIndex);

              return (
                <Tooltip
                  key={`${rowIndex}-${colIndex}`}
                  data={tooltip}
                  disabled={!Boolean(tooltip)}
                  tooltipProps={{
                    className: "bg-primary",
                  }}
                >
                  <div
                    className={`${
                      showMostRelevant ? "w-10" : "w-16"
                    } aspect-square border 
              flex justify-center items-center text-[11px]
              ${
                rowIndex === 0 && colIndex === gridSize - 1
                  ? isComplete
                    ? "border-success text-success"
                    : "border-error text-error"
                  : "border-gray-700"
              } break-words overflow-auto`}
                  >
                    {cell}
                  </div>
                </Tooltip>
              );
            })
          )}
        </div>
      </div>

      {displayShadowEndY && (
        <div className="absolute w-full flex justify-center bottom-0 right-0 z-20 pointer-events-none">
          <div
            className="max-w-full h-10 md:h-20"
            style={{
              width: gridRef.current ? gridRef.current.scrollWidth : "100%",
              background:
                "linear-gradient(180deg, rgba(18, 18, 18, 0) 0%, rgba(18, 18, 18, 0.8) 100%)",
            }}
          />
        </div>
      )}

      {displayShadowEndX && (
        <div className="absolute h-full flex items-center bottom-0 right-0 z-20 pointer-events-none">
          <div
            className="max-h-full w-10 md:w-20"
            style={{
              height: gridRef.current ? gridRef.current.scrollHeight : "100%",
              background:
                "linear-gradient(90deg, rgba(18, 18, 18, 0) 0%, rgba(18, 18, 18, 0.8) 100%)",
            }}
          />
        </div>
      )}

      {/* <motion.div
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
      /> */}
    </div>
  );
};

export default Chart;
