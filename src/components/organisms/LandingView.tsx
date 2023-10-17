import React from "react";
import { Chart, Editor, GrammarSelector } from "@/components";

const LandingView = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center gap-8 md:gap-12 p-24 overflow-hidden">
      <div className="flex flex-col gap-3 items-center">
        <div className="font-bold text-xl">Parsing Visualization</div>
        <div>
          <GrammarSelector />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-8 w-full overflow-hidden">
        <Editor />
        <Chart />
      </div>
    </div>
  );
};

export default LandingView;
