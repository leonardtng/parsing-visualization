import React, {
  ComponentProps,
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ForceGraph2D } from "react-force-graph";
import { Button, RefreshIcon, Switch } from "@/components";
import { useParsingContext } from "@/constants";
import * as d3 from "d3";
import cloneDeep from "lodash/cloneDeep";
import { useWindowSize } from "@/helpers";
import {
  GraphLink,
  GraphNode,
  HIGHLIGHT_PRIMARY_COLOR,
  HIGHLIGHT_SECONDARY_COLOR,
  HIGHLIGHT_TERTIARY_COLOR,
  LINK_COLOR,
} from "@/packages";

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

  const [isTree, setIsTree] = useState<boolean>(true);

  const handleChangeIsFree = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTree(event.target.checked);
  };

  const [isDebug, setIsDebug] = useState<boolean>(false);

  const handleChangeDebug = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDebug(event.target.checked);
  };

  const {
    chart,
    grammar,
    tokens,
    handleHighlightedBlock,
    clearHighlightedBlock,
    input,
    onInputChange,
  } = useParsingContext();

  const raw = useMemo(() => chart?.generateGraphData(), [chart]);

  const graphData: GraphData | undefined = useMemo(() => {
    const fg = fgRef?.current;

    if (!fg) return;

    const newGraphData = cloneDeep(raw);

    if (isTree) {
      fg.d3Force("custom", () => {
        newGraphData?.nodes.forEach((node) => {
          if (node.leafStart !== undefined) {
            // Leaves (Terminals)
            node.fx = BASE_LAYER_SEPARATION * node.leafStart;
            node.fy = 0;
          } else {
            // Things and Nonterminals
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
    }

    return newGraphData;
  }, [isTree, raw]);

  const [highlightNodes, setHighlightNodes] = useState<Set<string | null>>(
    new Set()
  );
  const [highlightParentNodes, setHighlightParentNodes] = useState<
    Set<string | null>
  >(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<GraphLink | null>>(
    new Set()
  );
  const [highlightParentLinks, setHighlightParentLinks] = useState<
    Set<GraphLink | null>
  >(new Set());
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);

  const updateHighlight = () => {
    setHighlightParentNodes(highlightParentNodes);
    setHighlightNodes(highlightNodes);
    setHighlightParentLinks(highlightParentLinks);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node: GraphNode) => {
    document.body.style.cursor = node ? "pointer" : "default";
    highlightParentNodes.clear();
    highlightNodes.clear();
    highlightLinks.clear();
    highlightParentLinks.clear();
    clearHighlightedBlock();

    const highlightAllChildren = (node: GraphNode) => {
      if (node.children) {
        node.children.forEach((child) => {
          highlightNodes.add(child.id);
          highlightAllChildren(child);
        });
      }
    };

    const highlightAllParents = (node: GraphNode) => {
      if (node.parent) {
        node.parent.forEach((parent) => {
          highlightParentNodes.add(parent.id);
          highlightAllParents(parent);
        });
      }
    };

    if (node) {
      highlightNodes.add(node.id);
      highlightAllChildren(node);

      highlightParentNodes.add(node.id);
      highlightAllParents(node);
    }

    graphData?.links.forEach((link) => {
      const source = link.source as GraphNode;
      const target = link.target as GraphNode;

      if (highlightNodes.has(source.id) && highlightNodes.has(target.id)) {
        highlightLinks.add(link as GraphLink);
      }

      if (
        highlightParentNodes.has(source.id) &&
        highlightParentNodes.has(target.id)
      ) {
        highlightParentLinks.add(link as GraphLink);
      }
    });

    if (node && node.getStartEnd) {
      const [start, end] = node.getStartEnd;
      handleHighlightedBlock(tokens.slice(start, end));
    }

    setHoverNode(node || null);
    updateHighlight();
  };

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
  }, [chart, isTree]);

  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden ${
        isRendered ? "relative" : "invisible absolute"
      }`}
    >
      <div className="absolute top-0 left-0 z-10 flex justify-center w-full">
        <div className="w-full max-w-[500px] md:max-w-none flex justify-between items-start gap-3">
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              if (isSpinning) return;

              setIsSpinning(true);
              setTimeout(() => setIsSpinning(false), 1000);

              const tempInput = input;
              onInputChange("");
              setTimeout(() => onInputChange(tempInput), 1000);

              setTimeout(() => fgRef.current?.zoomToFit(500, 50), 500);
            }}
          >
            <Button className={isSpinning ? `animate-ease-spin` : ""}>
              <RefreshIcon
                width={14}
                height={14}
                className="[&_path]:stroke-fontPrimary"
              />
            </Button>
            <div className="text-sm">Reset View</div>
          </Button>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs">Tree View</span>
              <Switch
                checked={isTree}
                onChange={handleChangeIsFree}
                className={`${
                  isTree
                    ? "[&_.switchCasing]:bg-primary"
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
                    ? "[&_.switchCasing]:bg-primary"
                    : "[&_.switchCasing]:bg-gray-300"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        cooldownTime={!isTree || graphData?.hasCycle ? Infinity : 5000}
        d3VelocityDecay={!isTree ? 0.05 : graphData?.hasCycle ? 0.01 : 0}
        linkColor={(link) =>
          highlightLinks.has(link as unknown as GraphLink)
            ? HIGHLIGHT_PRIMARY_COLOR
            : highlightParentLinks.has(link as unknown as GraphLink)
            ? HIGHLIGHT_TERTIARY_COLOR
            : LINK_COLOR
        }
        linkWidth={(link) =>
          highlightLinks.has(link as unknown as GraphLink) ||
          highlightParentLinks.has(link as unknown as GraphLink)
            ? 2
            : 1.5
        }
        linkDirectionalParticles={(link) =>
          highlightLinks.has(link as unknown as GraphLink) ||
          highlightParentLinks.has(link as unknown as GraphLink)
            ? 4
            : 0
        }
        linkDirectionalArrowLength={5}
        // linkDirectionalArrowRelPos={1}
        // linkCurvature={0.25}
        nodeColor={(node) => node.color}
        nodeLabel={(node) => {
          if (isDebug) {
            return "";
          } else {
            const [label, content] = node.hoverTooltip(grammar, tokens);

            return `<div style="max-width: 300px">
            <div style="color: ${HIGHLIGHT_PRIMARY_COLOR}"><b>${label}</b></div>
            <div><pre style="font-family: monospace">${
              content ?? ""
            }</pre></div>
          </div>`;
          }
        }}
        // onNodeHover={(node) => {
        //   document.body.style.cursor = node ? "pointer" : "default";
        // }}
        nodeRelSize={2}
        height={dimensions.height}
        width={dimensions.width}
        nodeCanvasObject={(node, ctx, globalScale) => {
          if (!node) return;
          let label = (
            isDebug ? (node.isEpsilon ? "" : node.id) : node.name(tokens)
          ) as string;

          const nodeScale = Math.max(Math.min(9 / globalScale, 9), 3);
          const nodeScaleSmall = Math.max(Math.min(3 / globalScale, 3), 1.5);
          const fontSize = Math.max(Math.min(14 / globalScale, 14), 2);

          if (node.isSymbol && !node.isEpsilon) {
            if (!node.isTerminal) {
              ctx.beginPath();
              ctx.arc(node.x!, node.y!, nodeScale * 1.4, 0, 2 * Math.PI, false);
              ctx.fillStyle = highlightNodes.has(node.id as string)
                ? HIGHLIGHT_PRIMARY_COLOR
                : highlightParentNodes.has(node.id as string)
                ? HIGHLIGHT_TERTIARY_COLOR
                : node.color;
              ctx.fill();
              ctx.font = `${fontSize}px Sans-Serif`;
            } else {
              ctx.beginPath();
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(
                (n) => n + fontSize * 1.5
              );
              ctx.fillStyle = highlightNodes.has(node.id as string)
                ? HIGHLIGHT_PRIMARY_COLOR
                : highlightParentNodes.has(node.id as string)
                ? HIGHLIGHT_TERTIARY_COLOR
                : node.color;
              ctx.roundRect(
                node.x! - bckgDimensions[0] / 2,
                node.y! - bckgDimensions[1] / 2,
                // @ts-ignore
                ...bckgDimensions,
                5 / globalScale
              );
              ctx.fill();
              ctx.font = `${fontSize}px monospace`;
            }

            ctx.fillStyle = "#fff";

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(label, node.x as number, node.y as number);
          } else {
            ctx.beginPath();
            ctx.arc(
              node.x!,
              node.y!,
              nodeScaleSmall * 1.4,
              0,
              2 * Math.PI,
              false
            );
            ctx.fillStyle =
              highlightNodes.has(node.id as string) ||
              highlightParentNodes.has(node.id as string)
                ? HIGHLIGHT_SECONDARY_COLOR
                : node.color;
            ctx.fill();

            ctx.fillStyle = node.color;

            if (isDebug)
              ctx.fillText(label, node.x as number, node.y as number);
          }
        }}
        nodeCanvasObjectMode={(node) => {
          if (!node.id) return;
          return highlightNodes.has(node.id.toString()) ||
            highlightParentNodes.has(node.id as string)
            ? "after"
            : "replace";
        }}
        onNodeHover={(node) => handleNodeHover(node as GraphNode)}
      />
    </div>
  );
};

export default ForceGraph;
