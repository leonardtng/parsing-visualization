import React from "react";
import {
  Chart,
  Editor,
  GrammarSelector,
  ProductionMapDrawer,
} from "@/components";
import Draggable, { DraggableCore } from "react-draggable";

const LandingView = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center gap-3 md:gap-6 pt-12 md:pt-24 overflow-hidden z-0">
      <div className="flex flex-col gap-3 items-center z-10">
        <div className="font-bold text-xl mb-1">Parsing Visualization</div>
        <GrammarSelector />
      </div>

      <div className="flex-1 flex flex-col items-center gap-5 w-full overflow-hidden z-0">
        <Editor />
        <Chart />
      </div>

      <ProductionMapDrawer />
    </div>
  );
};

export default LandingView;
