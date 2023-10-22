import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Draggable, {
  DraggableCore,
  DraggableData,
  DraggableEvent,
  DraggableEventHandler,
} from "react-draggable";
import { FaArrowRight, FaMap, FaMinus } from "react-icons/fa";
import { useParsingContext } from "@/constants";
import { useScrollShadow } from "@/helpers";

const ProductionMapDrawer = () => {
  const DRAWER_HEIGHT = 300;
  const BUTTON_HEIGHT = 40;

  const draggerRef = useRef<Draggable>(null);
  const { grammar } = useParsingContext();
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<boolean>(false);
  const { scrollContainerProps, displayShadowStartY, displayShadowEndY } =
    useScrollShadow();

  const toggleShowDrawer = () => {
    setShowDrawer((prev) => !prev);
    draggerRef.current?.setState({ x: 0, y: 0 });
    setDragging(false);
  };

  const onDrag = () => {
    setDragging(true);
  };

  return (
    <Draggable
      ref={draggerRef}
      position={showDrawer ? undefined : { x: 0, y: 0 }}
      onStart={() => setDragStart(true)}
      onStop={() => setDragStart(false)}
      onDrag={onDrag}
      disabled={!showDrawer}
    >
      <div className="absolute bottom-0 right-0 z-50">
        <motion.div
          layout
          transition={{ duration: 0.35 }}
          style={{
            height: DRAWER_HEIGHT,
            bottom: showDrawer ? 0 : -(DRAWER_HEIGHT - BUTTON_HEIGHT),
          }}
          className={`fixed right-0 bg-surface w-[200px] rounded-tl-lg text-sm ${
            dragging ? "rounded-tr-lg rounded-b-lg overflow-clip" : ""
          }`}
        >
          <div
            className="flex justify-between items-center px-3 cursor-pointer font-bold"
            style={{ height: BUTTON_HEIGHT }}
            onClick={toggleShowDrawer}
          >
            <div>Production Maps</div>
            {showDrawer ? <FaMinus /> : <FaMap />}
          </div>

          <div
            className={`relative w-full h-full overflow-hidden border-t border-strokeSecondary z-0 ${
              dragging || showDrawer
                ? dragStart
                  ? "cursor-grabbing"
                  : "cursor-grab"
                : ""
            }`}
            style={{
              height: DRAWER_HEIGHT - BUTTON_HEIGHT,
            }}
          >
            {displayShadowStartY && (
              <div
                className="absolute h-14 w-full top-0 left-0 pointer-events-none z-10"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(44, 44, 44, 0) 0%, rgba(44, 44, 44, 0.95) 100%)",
                }}
              />
            )}

            <div
              {...scrollContainerProps}
              className="w-full h-full overflow-auto no-scrollbar"
            >
              {Object.entries(grammar.data.productionMap).map(
                ([key, value], index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div>{key}</div>
                      <FaArrowRight />
                    </div>
                    <div className="text-end">
                      {value.map(([label, items], index) => (
                        <div key={index}>
                          {label === "e" ? '""' : items.join(" ")}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>

            {displayShadowEndY && (
              <div
                className="absolute h-14 w-full bottom-0 left-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(44, 44, 44, 0) 0%, rgba(44, 44, 44, 0.95) 100%)",
                }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </Draggable>
  );
};

export default ProductionMapDrawer;
