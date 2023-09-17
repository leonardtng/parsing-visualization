import { RefObject, SyntheticEvent, useEffect, useState } from "react";

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
