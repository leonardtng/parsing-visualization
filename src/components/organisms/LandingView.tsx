import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
import dynamic from "next/dynamic";
import { useTieredEffect, useWindowSize } from "@/helpers";

const NoSSRForceGraph = dynamic(() => import("../molecules/ForceGraph"), {
  ssr: false,
});

const LandingView = () => {
  const [winWidth, winHeight] = useWindowSize();
  const { shadowStyles } = useTieredEffect();

  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const onTabChange = (
    event: React.SyntheticEvent,
    newActiveTabIndex: number
  ) => setActiveTabIndex(newActiveTabIndex);

  const tabs: TabData[] = useMemo(
    () => [
      {
        label: "Force",
        Content: () => <></>,
      },
      {
        label: "Table",
        Content: () => <></>,
      },
    ],
    []
  );

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

        <NoSSRForceGraph isRendered={activeTabIndex === 0} />

        <Chart isRendered={activeTabIndex === 1} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="fixed rounded-full bg-background z-0"
        style={{
          top: winHeight + 60,
          width: winWidth,
          height: winWidth,
          ...shadowStyles,
        }}
      />

      <ProductionMapDrawer />
    </div>
  );
};

export default LandingView;
