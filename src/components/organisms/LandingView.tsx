import React, { useState } from "react";
import {
  Chart,
  Editor,
  GrammarSelector,
  ParseTree,
  ProductionMapDrawer,
  TabContent,
  TabData,
  Tabs,
} from "@/components";
import ForceGraph from "../molecules/ForceGraph";
import dynamic from "next/dynamic";
const NoSSRForceGraph = dynamic(() => import("../molecules/ForceGraph"), {
  ssr: false,
});

const LandingView = () => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const onTabChange = (
    event: React.SyntheticEvent,
    newActiveTabIndex: number
  ) => setActiveTabIndex(newActiveTabIndex);

  const tabs: TabData[] = [
    {
      label: "Force",
      Content: () => <NoSSRForceGraph />,
    },
    {
      label: "Tree",
      Content: () => <ParseTree />,
    },
    {
      label: "Table",
      Content: () => <Chart />,
    },
  ];

  return (
    <div className="w-full h-screen flex flex-col items-center gap-3 md:gap-6 pt-12 md:pt-24 overflow-hidden z-0">
      <div className="flex flex-col gap-3 items-center z-10">
        <div className="font-bold text-xl mb-1">Parsing Visualization</div>
        <GrammarSelector />
      </div>

      <div className="flex-1 flex flex-col items-center gap-5 w-full overflow-hidden z-0">
        <Editor />

        <div className="w-full flex justify-center">
          <Tabs
            tabs={tabs}
            value={activeTabIndex}
            onChange={onTabChange}
            className="w-full max-w-[500px] [&_.tabsBase]:space-x-0 [&_.tabsBase]:border-b-fontSecondary [&_.tabsUnderline]:bg-primary [&_.inactiveTabsButton]:text-fontSecondary"
          />
        </div>
        <TabContent tabs={tabs} value={activeTabIndex} />
      </div>

      <ProductionMapDrawer />
    </div>
  );
};

export default LandingView;
