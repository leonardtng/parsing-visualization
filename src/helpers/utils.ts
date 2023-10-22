import {
  RefObject,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAnalyzeParse } from "@/helpers";

/**
 * Function that returns a boolean indicating if the user is on an Android device.
 *
 * @returns Boolean indicating if the user is on an Android device.
 *
 */

export function isAndroid(): boolean {
  return (
    typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)
  );
}

/**
 * Function that returns a boolean indicating if the user is on a small iOS device.
 *
 * @returns Boolean indicating if the user is on a small iOS device.
 *
 */
export function isSmallIOS(): boolean {
  return (
    typeof navigator !== "undefined" && /iPhone|iPod/.test(navigator.userAgent)
  );
}

/**
 * Function that returns a boolean indicating if the user is on a large iOS device.
 *
 * @returns Boolean indicating if the user is on a large iOS device.
 *
 */
export function isLargeIOS(): boolean {
  return (
    typeof navigator !== "undefined" &&
    (/iPad/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1))
  );
}

/**
 * Function that returns a boolean indicating if the user is on an iOS device.
 *
 * @returns Boolean indicating if the user is on an iOS device.
 *
 */
export function isIOS(): boolean {
  return isSmallIOS() || isLargeIOS();
}

/**
 * Function that returns a boolean indicating if the user is on a mobile device.
 *
 * @returns Boolean indicating if the user is on a mobile device.
 *
 */
export function isMobile(): boolean {
  return isAndroid() || isIOS();
}

/**
 * Hook that detects changes in window size and triggers a re-render
 *
 * @returns Array containing window width and height
 */
export const useWindowSize = () => {
  const [size, setSize] = useState<number[]>([0, 0]);

  useEffect(() => {
    const updateSize = () => {
      setSize([
        window.innerWidth > window.outerWidth
          ? window.outerWidth
          : window.innerWidth,
        window.innerHeight > window.outerHeight
          ? window.outerHeight
          : window.innerHeight,
      ]);
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
};

/**
 * Hook that allows programmatically accessing default Tailwind specific breakpoints
 *
 * @param breakpoint Tailwind breakpoint to check against
 *
 * @returns Whether the current window width is within the breakpoint
 */
export const useBreakpoint = (
  breakpoint: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
) => {
  const [winWidth] = useWindowSize();

  switch (breakpoint) {
    case "xs":
      return winWidth >= 0;
    case "sm":
      return winWidth >= 640;
    case "md":
      return winWidth >= 768;
    case "lg":
      return winWidth >= 1024;
    case "xl":
      return winWidth >= 1280;
    case "2xl":
      return winWidth >= 1536;
  }
};

/**
 * Hook that alerts clicks outside of the passed ref.
 *
 * @param ref Wrapper ref object.
 * @param callback Callback function on click outside wrapper.
 */
export const useOutsideAlerter = (
  ref: RefObject<HTMLElement>,
  callback: (event?: MouseEvent | SyntheticEvent) => void
) => {
  useEffect(() => {
    // init callback if clicked on outside of element
    const handleClickOutside = (event: MouseEvent | SyntheticEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

interface ScrollShadowOptions {
  deps?: unknown[];
}

/**
 * Hook that manages scroll shadow states.
 *
 * @param options.transformScroll if true, will transform vertical scroll mapping to be horizontal
 * @param options.orientation "horizontal" or "vertical" scroll shadow
 *
 * @returns containerProps for scrolling container, states for start and end shadows
 */
export const useScrollShadow = (options?: ScrollShadowOptions) => {
  const { deps } = options ?? {};

  const [displayShadowStartY, setDisplayShadowStartY] =
    useState<boolean>(false);
  const [displayShadowEndY, setDisplayShadowEndY] = useState<boolean>(false);
  const [displayShadowStartX, setDisplayShadowStartX] =
    useState<boolean>(false);
  const [displayShadowEndX, setDisplayShadowEndX] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollPositionY, setScrollPositionY] = useState(0);
  const [scrollPositionX, setScrollPositionX] = useState(0);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const startY = containerRef.current?.scrollTop;
      const startX = containerRef.current?.scrollLeft;

      const clientMaximumY = containerRef?.current?.clientHeight;
      const clientMaximumX = containerRef?.current?.clientWidth;

      const scrollMaximumY = containerRef?.current?.scrollHeight;
      const scrollMaximumX = containerRef?.current?.scrollWidth;

      const atStartY = startY < 10;
      const atStartX = startX < 10;

      const reachedEndY = scrollMaximumY - startY - 10 < clientMaximumY;
      const reachedEndX = scrollMaximumX - startX - 10 < clientMaximumX;

      const needScrollY = clientMaximumY < scrollMaximumY;
      const needScrollX = clientMaximumX < scrollMaximumX;

      setDisplayShadowStartY(Boolean(needScrollY && !atStartY));
      setDisplayShadowEndY(Boolean(needScrollY && !reachedEndY));

      setDisplayShadowStartX(Boolean(needScrollX && !atStartX));
      setDisplayShadowEndX(Boolean(needScrollX && !reachedEndX));

      const scrollPositionY = containerRef.current?.scrollTop;
      const scrollPositionX = containerRef.current?.scrollLeft;

      setScrollPositionY(scrollPositionY);
      setScrollPositionX(scrollPositionX);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current, deps]);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  return {
    scrollContainerProps: { ref: containerRef, onScroll: handleScroll },
    scrollPositionY,
    displayShadowStartY,
    displayShadowEndY,
    scrollPositionX,
    displayShadowStartX,
    displayShadowEndX,
  };
};

export const getTierEffect = (tier: number, isWeb: boolean) => {
  // Note the difference for web and mobile shadows, due to rendering issues,
  // need translateZ for mobile so drop shadow works
  switch (tier) {
    case 2:
      return {
        boxStyles: {
          background: "#FD3936",
          boxShadow: " 0px 0px 1 0px #FD3936, 0px 0px 26 0px #FD3936",
        },
        shadowStyles:
          isWeb && !isMobile()
            ? {
                filter: `drop-shadow(0px -150px 300px #770909)`,
              }
            : {
                filter: `drop-shadow(0px -300px 180px #770909)`,
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)",
              },
      };
    case 1:
      return {
        boxStyles: {
          background: "#3DED91",
          boxShadow: "0px 0px 1px 0px #37B875, 0px 0px 26px 0px #37B875",
        },
        shadowStyles:
          isWeb && !isMobile()
            ? {
                filter: `drop-shadow(0px -150px 300px #195837)`,
              }
            : {
                filter: `drop-shadow(0px -300px 180px #195837)`,
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)",
              },
      };
    case 0:
    default:
      return {
        boxStyles: {
          background: "#676767",
          boxShadow: "0px 0px 14px 0px #676767",
        },
        shadowStyles:
          isWeb && !isMobile()
            ? {
                filter: `drop-shadow(0px -150px 300px #1C2845)`,
              }
            : {
                filter: `drop-shadow(0px -300px 100px #1C2845)`,
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)",
              },
      };
  }
};

export const useTieredEffect = () => {
  const isWeb = useBreakpoint("md");
  const { gridSize, isComplete } = useAnalyzeParse();

  const tieredEffect = useMemo(
    () => getTierEffect(gridSize === 0 ? 0 : isComplete ? 1 : 2, isWeb),
    [gridSize, isComplete, isWeb]
  );

  return tieredEffect;
};
