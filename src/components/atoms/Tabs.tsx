import React, {
  FC,
  HTMLAttributes,
  SVGAttributes,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";

export interface TabData {
  label: string;
  Content: () => JSX.Element;
  Icon?: FC<SVGAttributes<SVGSVGElement>>;
  slug?: string;
  disabled?: boolean;
}

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: TabData[];
  value?: number;
  onChange?: (event: SyntheticEvent, index: number) => void;
}

export const Tabs: FC<TabsProps> = ({
  tabs,
  value,
  onChange,
  className,
  ...componentProps
}: TabsProps) => {
  const [internalActiveTabIndex, setInternalActiveTabIndex] = useState(
    value ?? 0
  );
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

  const tabsRef = useRef<HTMLButtonElement[]>([]);

  const handleChange = (index: number) => (event: SyntheticEvent) => {
    setInternalActiveTabIndex(index);
    onChange && onChange(event, index);
  };

  useEffect(() => {
    const currentTab = tabsRef.current[value ?? internalActiveTabIndex];
    setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
    setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
    value && setInternalActiveTabIndex(value);
  }, [internalActiveTabIndex, value]);

  return (
    <div {...componentProps} className={`tabsRoot relative ${className}`}>
      <div className="tabsBase flex space-x-6 border-b">
        {tabs.map((tab, index) => {
          return (
            <button
              key={index}
              ref={(element) =>
                (tabsRef.current[index] = element as HTMLButtonElement)
              }
              className={`tabsButton pt-2 pb-3 px-3 flex items-center gap-2 disabled:cursor-not-allowed ${
                index !== internalActiveTabIndex
                  ? "inactiveTabsButton"
                  : "activeTabsButton"
              }`}
              onClick={handleChange(index)}
              disabled={tab.disabled}
            >
              {tab.Icon && <tab.Icon />}
              {tab.label}
            </button>
          );
        })}
      </div>
      <span
        className="tabsUnderline absolute bottom-0 block h-1 transition-all duration-300 bg-black"
        style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
      />
    </div>
  );
};
