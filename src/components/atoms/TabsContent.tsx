import React, { FC } from "react";
import { TabData } from "./Tabs";

export interface TabContentProps {
  tabs: TabData[];
  value: number;
}

export const TabContent: FC<TabContentProps> = ({
  tabs,
  value,
}: TabContentProps) => {
  const ActiveTab = tabs[value];
  return <ActiveTab.Content />;
};
