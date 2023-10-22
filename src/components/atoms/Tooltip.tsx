import React, {
  ChangeEvent,
  FC,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  data: ReactNode;
  disabled?: boolean;
  tooltipProps?: TooltipContentProps;
}

export const Tooltip: FC<TooltipProps> = ({
  children,
  data,
  className,
  disabled = false,
  tooltipProps,
  ...componentProps
}: TooltipProps) => {
  const [tooltipInit, setTooltipInit] = useState<boolean>(false);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (tooltipRef.current && tooltipOpen) {
        tooltipRef.current.style.left = e.pageX + "px";
        tooltipRef.current.style.top = e.pageY + "px";
        setTooltipInit(true);
      } else {
        setTooltipInit(false);
      }
    };
    document.addEventListener("mousemove", fn, false);
  }, [tooltipOpen]);

  return (
    <>
      <div
        className={`tooltipRoot relative flex items-center ${
          !disabled && "cursor-pointer"
        } overflow-visible ${className}`}
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
        onPointerEnter={() => setTooltipOpen(true)}
        onPointerLeave={() => setTooltipOpen(false)}
        {...componentProps}
      >
        {children}
      </div>
      {tooltipOpen && !disabled && (
        <div
          {...tooltipProps}
          ref={tooltipRef}
          className={`tooltipBase ${
            tooltipProps?.className
          } absolute flex items-center text-sm z-50 
            px-2 bg-backgroundPaper dark:bg-darkBackgroundPaper rounded-lg shadow-lg ${
              tooltipInit ? "" : "hidden"
            }`}
        >
          <div className="tooltipInner py-1">{data}</div>
        </div>
      )}
    </>
  );
};
