import React from "react";
import { Chart, Editor, GrammarSelector } from "@/components";

const LandingView = () => {
  return (
    <div className="flex flex-col items-center gap-8 md:gap-12">
      <div className="flex flex-col gap-3 items-center">
        <div className="font-bold text-xl">Parsing Visualization</div>
        <div>
          <GrammarSelector />
        </div>
      </div>

      <div className="flex flex-col gap-3 w-[500px]">
        <Editor />
        <Chart />
      </div>
    </div>
  );
};

export default LandingView;
