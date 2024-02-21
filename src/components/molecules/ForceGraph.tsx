import React, { ComponentProps, useEffect, useRef, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import * as d3 from "d3";
import { useParser } from "@/helpers";
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
  console.log(graphData);
  useEffect(() => {
    const fg = fgRef?.current;

    if (!fg) return;

    const newGraphData = chart?.generateGraphData();

    // Deactivate existing force
    fg.d3Force("center", () => {});
    fg.d3Force("charge", () => {});

    // Add collision and bounding box forces
    // fg.d3Force("collide", d3.forceCollide(4));

    fg.d3Force("box", () => {
      const SQUARE_HALF_SIDE = N * 2;

      newGraphData?.nodes.forEach((node) => {
        if (node.leafStart !== undefined) {
          node.fx = 100 * node.leafStart;
          node.fy = 0;
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

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={graphData}
      cooldownTime={Infinity}
      d3AlphaDecay={0}
      d3VelocityDecay={0}
      linkColor={() => "rgba(255,255,255,0.2)"}
      linkWidth={3}
      nodeCanvasObject={(node, ctx, globalScale) => {
        if (!node) return;
        const label = node.id as string;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;

        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(
          (n) => n + fontSize * 0.2
        ); // some padding

        // ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        // ctx.fillRect(
        //   node.x - bckgDimensions[0] / 2,
        //   node.y - bckgDimensions[1] / 2,
        //   ...bckgDimensions
        // );

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fillText(label, node.x as number, node.y as number);

        node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
      }}
    />
  );
};

export default ForceGraph;
