import React, { FC } from "react";
import { HTMLMotionProps, motion } from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<"button"> {}

export const Button: FC<ButtonProps> = ({
  children,
  ...componentProps
}: ButtonProps) => {
  return (
    <motion.button
      // whileHover={{ scale: 1.03 }}
      {...(componentProps.disabled ? {} : { whileTap: { scale: 0.98 } })}
      transition={{ duration: 0.1 }}
      {...componentProps}
    >
      {children}
    </motion.button>
  );
};
