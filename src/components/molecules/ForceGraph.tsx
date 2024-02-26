import React, { ComponentProps, useEffect, useRef, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import { Switch } from "@/components";
import { useParsingContext } from "@/constants";

type GraphData = ComponentProps<typeof ForceGraph2D>["graphData"];
type FGRef = ComponentProps<typeof ForceGraph2D>["ref"];

const ForceGraph = () => {
  const fgRef: FGRef = useRef();

  const { chart } = useParsingContext();

  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });

  useEffect(() => {
    const fg = fgRef?.current;

    if (!fg) return;

    const newGraphData = chart?.generateGraphData();

    // Deactivate existing force
    // fg.d3Force("center", () => {});
    // fg.d3Force("charge", () => {});

    // Add collision and bounding box forces
    // fg.d3Force("collide", d3.forceCollide(4));

    fg.d3Force("box", () => {
      const SQUARE_HALF_SIDE = N * 2;

      newGraphData?.nodes.forEach((node) => {
        if (node.leafStart !== undefined) {
          // Leaves (Terminals)
          node.fx = 100 * node.leafStart;
          node.fy = 0;
        } else {
          // Things and Nonterminals
          if (node.y && node.y > -50) {
            node.y = -50;
          }
        }
      });
    });

    // // Generate nodes
    const N = 80;
    // const nodes = [...Array(N).keys()].map(() => ({
    //   // Initial velocity in random direction
    //   vx: Math.random() * 2 - 1,
    //   vy: Math.random() * 2 - 1,
    //   x: undefined,
    //   y: undefined,
    // }));

    setGraphData(newGraphData);
  }, [chart]);

  const [isDebug, setIsDebug] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDebug(event.target.checked);
  };

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 z-10 flex justify-center w-full">
        <div className="w-full max-w-[500px] flex justify-end items-center gap-2">
          <span className="text-xs">Debug</span>
          <Switch checked={isDebug} onChange={handleChange} />
        </div>
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        cooldownTime={Infinity}
        d3VelocityDecay={0}
        linkColor={() => "#353945"}
        linkWidth={1.5}
        linkDirectionalArrowLength={2.5}
        // linkDirectionalArrowRelPos={1}
        // linkCurvature={0.25}
        nodeColor={(node) => node.color}
        nodeLabel={isDebug ? undefined : "id"}
        nodeCanvasObject={(node, ctx, globalScale) => {
          if (!node) return;
          const label = (isDebug ? node.id : node.name) as string;
          const fontSize = 14 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;

          if (node.isSymbol) {
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, 2 * 1.4, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color;
            ctx.fill();

            ctx.fillStyle = "#fff";
          } else {
            ctx.fillStyle = node.color;
          }

          // const textWidth = ctx.measureText(label).width;
          // const bckgDimensions = [textWidth, fontSize].map(
          //   (n) => n + fontSize * 0.2
          // ); // some padding

          // ctx.fillStyle = node.color;
          // ctx.fillRect(
          //   node.x - bckgDimensions[0] / 2,
          //   node.y - bckgDimensions[1] / 2,
          //   ...bckgDimensions
          // );

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.fillText(label, node.x as number, node.y as number);

          // node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
        }}
      />
    </div>
  );
};

export default ForceGraph;
