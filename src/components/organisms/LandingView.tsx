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
        label: "Force-Directed Tree / Graph",
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
    <div className="w-full h-screen flex flex-col items-center gap-3 md:gap-6 pt-8 overflow-hidden z-0">
      <div className="flex-1 flex flex-col md:flex-row md:gap-12 items-center md:items-start gap-5 w-full overflow-hidden z-0">
        <div className="h-auto md:h-full min-w-none w-[95vw] md:w-[30%] md:min-w-[30%] md:pl-12 md:pb-12 flex flex-col gap-8 items-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="font-bold text-xl mb-1">Parsing Visualization</div>
            <GrammarSelector showFilter={activeTabIndex === 1} />
          </div>
          <Editor />
        </div>

        <div className="h-auto md:h-full flex-1 w-[95vw] md:w-full flex flex-col gap-5 overflow-hidden px-0 md:pr-12">
          <div className="w-full flex justify-center">
            <Tabs
              tabs={tabs}
              value={activeTabIndex}
              onChange={onTabChange}
              className="w-full max-w-[500px] md:max-w-none [&_.tabsBase]:space-x-0 [&_.tabsBase]:border-b-fontSecondary [&_.tabsUnderline]:bg-primary [&_.inactiveTabsButton]:text-fontSecondary"
            />
          </div>

          <NoSSRForceGraph isRendered={activeTabIndex === 0} />

          <Chart isRendered={activeTabIndex === 1} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="fixed rounded-full bg-background -z-10"
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
