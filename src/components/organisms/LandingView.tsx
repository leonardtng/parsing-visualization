import React from "react";
import { Chart, Editor, GrammarSelector } from "@/components";

const LandingView = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center gap-3 md:gap-6 pt-12 md:pt-24 overflow-hidden">
      <div className="flex flex-col gap-3 items-center">
        <div className="font-bold text-xl">Parsing Visualization</div>
        <GrammarSelector />
      </div>

      <div className="flex-1 flex flex-col items-center gap-5 w-full overflow-hidden">
        <Editor />
        <Chart />
      </div>
    </div>
  );
};

export default LandingView;
