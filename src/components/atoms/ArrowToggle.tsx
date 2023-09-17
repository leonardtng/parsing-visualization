import React, { FC } from "react";
import { HTMLMotionProps, motion } from "framer-motion";

export interface ArrowToggleProps extends HTMLMotionProps<"div"> {
  trigger?: boolean;
}

export const ArrowToggle: FC<ArrowToggleProps> = ({
  trigger,
  className,
  ...componentProps
}: ArrowToggleProps) => {
  const arrowAnimation: HTMLMotionProps<"div">["variants"] = {
    close: {
      rotate: 0,
      transition: {
        duration: 0.3,
      },
    },
    open: {
      rotate: 180,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      {...componentProps}
      animate={trigger ? "open" : "close"}
      variants={arrowAnimation}
      className={`arrowToggleRoot ${className}`}
    >
      <svg
        width="9"
        height="6"
        viewBox="0 0 9 6"
        xmlns="http://www.w3.org/2000/svg"
        className={`arrowToggleArrow fill-fontPrimary`}
      >
        <path d="M3.82184 4.78156C4.20487 5.13501 4.79513 5.13501 5.17816 4.78156L8.24906 1.94782C8.91812 1.33043 8.48129 0.212904 7.5709 0.212904H1.4291C0.518712 0.212904 0.0818841 1.33043 0.750944 1.94782L3.82184 4.78156Z" />
      </svg>
    </motion.div>
  );
};
