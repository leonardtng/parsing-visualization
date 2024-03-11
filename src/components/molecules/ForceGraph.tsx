import React, {
  ComponentProps,
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ForceGraph2D } from "react-force-graph";
import { Switch } from "@/components";
import { useParsingContext } from "@/constants";
import * as d3 from "d3";
import { useWindowSize } from "@/helpers";

const BASE_LAYER_SEPARATION = 30;

interface AdditionalGraphData {
  hasCycle: boolean;
}

type GraphData = ComponentProps<typeof ForceGraph2D>["graphData"] &
  Partial<AdditionalGraphData>;
type FGRef = ComponentProps<typeof ForceGraph2D>["ref"];

interface Props {
  isRendered?: boolean;
}

const ForceGraph: FC<Props> = ({ isRendered = true }: Props) => {
  const [winWidth, winHeight] = useWindowSize();

  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef: FGRef = useRef();

  const [isFree, setIsFree] = useState<boolean>(false);

  const handleChangeIsFree = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFree(event.target.checked);
  };

  const [isDebug, setIsDebug] = useState<boolean>(false);

  const handleChangeDebug = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDebug(event.target.checked);
  };

  const { chart } = useParsingContext();

  const graphData: GraphData | undefined = useMemo(() => {
    const fg = fgRef?.current;

    if (!fg) return;

    const newGraphData = chart?.generateGraphData();

    // Deactivate existing force
    // fg.d3Force("center", () => {});
    // fg.d3Force("charge")?.forceManyBody().strength(-100);

    // Add collision and bounding box forces
    // fg.d3Force("collide", d3.forceCollide(4));

    // fg.d3Force("box", () => {
    //   newGraphData?.nodes.forEach((node) => {
    //     if (node.leafStart !== undefined) {
    //       // Leaves (Terminals)
    //       node.fx = 100 * node.leafStart;
    //       node.fy = 0;
    //     } else {
    //       // Things and Nonterminals
    //       if (node.y && node.y > -50) {
    //         node.y = -50;
    //       }
    //     }
    //   });
    // });

    // fg.d3Force("collide", d3.forceCollide(4));

    // fg.d3Force("box", () => {
    //   const SQUARE_HALF_SIDE = 80 * 2;

    //   newGraphData?.nodes.forEach((node) => {
    //     const x = node.x || 0,
    //       y = node.y || 0;

    //     if (y > -50) {
    //       node.vy *= -1;
    //     }
    //   });
    // });

    if (!isFree) {
      fg.d3Force("custom", () => {
        newGraphData?.nodes.forEach((node) => {
          if (node.leafStart !== undefined) {
            // Leaves (Terminals)
            node.fx = BASE_LAYER_SEPARATION * node.leafStart;
            node.fy = 0;
          } else {
            // Things and Nonterminals
            // if (node.y && node.y > -50) {
            //   // if (node.id === `{"start":0,"end":1,"symbol":{"name":"S"}}`)
            //   //   console.log(node.vy);
            //   node.vy = -50;
            // }

            if (!newGraphData.hasCycle) {
              const baseLayerLength = new Set(
                newGraphData?.nodes
                  .filter((node) => node.leafStart !== undefined)
                  .map((node) => node.leafStart)
              ).size;

              if (node.level !== undefined) node.fy = -node.level * 50;
              node.x = (baseLayerLength * BASE_LAYER_SEPARATION) / 2;
            } else {
              const baseLayerLength = new Set(
                newGraphData?.nodes
                  .filter((node) => node.leafStart !== undefined)
                  .map((node) => node.leafStart)
              ).size;

              node.vx = (baseLayerLength * BASE_LAYER_SEPARATION) / 2;
              node.vy = (-baseLayerLength * BASE_LAYER_SEPARATION) / 2;
            }
          }
        });
      });

      // fg.d3Force("charge")?.strength(-100);
    }

    // // Generate nodes
    // const nodes = [...Array(N).keys()].map(() => ({
    //   // Initial velocity in random direction
    //   vx: Math.random() * 2 - 1,
    //   vy: Math.random() * 2 - 1,
    //   x: undefined,
    //   y: undefined,
    // }));

    return newGraphData;
  }, [chart, isFree]);

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (isRendered) {
      fgRef.current?.zoomToFit(500, 50);

      setDimensions({
        width: containerRef.current?.clientWidth || 0,
        height: containerRef.current?.clientHeight || 0,
      });
    }
  }, [isRendered, winWidth, winHeight]);

  useEffect(() => {
    setTimeout(() => fgRef.current?.zoomToFit(500, 50), 500);
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden ${
        isRendered ? "relative" : "invisible absolute"
      }`}
    >
      <div className="absolute top-0 left-0 z-10 flex justify-center w-full">
        <div className="w-full max-w-[500px] md:max-w-none flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs">Free</span>
            <Switch
              checked={isFree}
              onChange={handleChangeIsFree}
              className={`${
                isFree
                  ? "[&_.switchCasing]:bg-success"
                  : "[&_.switchCasing]:bg-gray-300"
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs">Debug</span>
            <Switch
              checked={isDebug}
              onChange={handleChangeDebug}
              className={`${
                isDebug
                  ? "[&_.switchCasing]:bg-success"
                  : "[&_.switchCasing]:bg-gray-300"
              }`}
            />
          </div>
        </div>
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        cooldownTime={isFree || graphData?.hasCycle ? Infinity : 5000}
        d3VelocityDecay={isFree ? 0.05 : graphData?.hasCycle ? 0.01 : 0}
        linkColor={() => "#353945"}
        linkWidth={1.5}
        linkDirectionalArrowLength={5}
        // linkDirectionalArrowRelPos={1}
        // linkCurvature={0.25}
        nodeColor={(node) => node.color}
        nodeLabel={isDebug ? undefined : "id"}
        onNodeDragEnd={(node, translate) => {
          if (!isFree && node.y && node.y > -50) {
            node.y = -Math.abs(node.y);
          }
        }}
        height={dimensions.height}
        width={dimensions.width}
        nodeCanvasObject={(node, ctx, globalScale) => {
          if (!node) return;
          const label = (isDebug ? node.id : node.name) as string;
          const fontSize = 14 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;

          const nodeScale = 11 / globalScale;

          if (node.isSymbol) {
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, nodeScale * 1.4, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color;
            ctx.fill();

            ctx.fillStyle = "#fff";

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(label, node.x as number, node.y as number);
          } else {
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, 1 * 1.4, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color;
            ctx.fill();

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

          // ctx.textAlign = "center";
          // ctx.textBaseline = "middle";

          // ctx.fillText(label, node.x as number, node.y as number);

          // node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
        }}
      />
    </div>
  );
};

export default ForceGraph;
