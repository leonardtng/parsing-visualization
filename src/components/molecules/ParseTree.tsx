import { buildParseTree } from "@/constants/tree";
import { useAnalyzeParse, useGetCellData } from "@/helpers";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Tree from "react-d3-tree";

const ParseTree = () => {
  const { grid } = useAnalyzeParse();
  const { getCellData } = useGetCellData();

  const jsonArray = useMemo(() => {
    return buildParseTree(
      grid?.map((row, rowIndex) =>
        row.map((col, colIndex) => {
          const { cell, tooltip } = getCellData(col, rowIndex, colIndex);

          return cell ?? null;
        })
      )
    )?.toJsonTreeArray();
  }, [getCellData, grid]);

  const shouldRecenterTreeRef = useRef(true);
  const [treeTranslate, setTreeTranslate] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (treeContainerRef.current && shouldRecenterTreeRef.current) {
      shouldRecenterTreeRef.current = false;
      const dimensions = treeContainerRef.current.getBoundingClientRect();

      setTreeTranslate({
        x: dimensions.width / 2,
        y: 50,
      });
    }
  }, []);

  return (
    <div
      id="treeWrapper"
      ref={treeContainerRef}
      className="relative w-full h-full overflow-hidden z-0 flex justify-center items-center m-auto"
    >
      {jsonArray?.map((json, index) => (
        <Tree
          key={index}
          data={json}
          orientation="vertical"
          collapsible
          rootNodeClassName={`${
            json.name !== "" ? "node__root" : "node__root_error"
          }`}
          branchNodeClassName="node__branch"
          leafNodeClassName="node__leaf"
          pathFunc="step"
          translate={treeTranslate}
        />
      ))}
    </div>
  );
};

export default ParseTree;
