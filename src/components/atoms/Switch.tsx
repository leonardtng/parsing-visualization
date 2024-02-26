import React, { FC, useState, HTMLAttributes, useRef } from "react";
import { motion } from "framer-motion";

export interface SwitchProps extends HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  label?: string;
  labelReverse?: boolean;
  disabled?: boolean;
}

export const Switch: FC<SwitchProps> = ({
  checked,
  label,
  labelReverse = false,
  className,
  onChange,
  disabled = false,
  ...componentProps
}) => {
  const inputKey = useRef<number | string>(
    componentProps.id ?? label ?? Math.random() * 100
  );

  const [internalChecked, setInternalChecked] = useState<boolean>(
    checked ?? false
  );

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalChecked(event.target.checked);
    if (onChange) onChange(event);
  };

  return (
    <div
      {...componentProps}
      className={`switchRoot w-fit flex items-center ${
        labelReverse ? "flex-row-reverse" : ""
      } ${className}`}
    >
      <div
        className={`switchBase relative inline-block w-10 align-middle select-none ${
          !label ? "m-0" : labelReverse ? "ml-2" : "mr-2"
        }`}
      >
        <motion.input
          layout
          type="checkbox"
          name="switch"
          id={`switch-${inputKey.current}`}
          className={`switchInput peer absolute block w-[18px] h-[18px] top-[2px] 
          rounded-full bg-white appearance-none cursor-pointer disabled:cursor-not-allowed ${
            checked ?? internalChecked ? "right-[2px]" : "left-[2px]"
          }`}
          onChange={handleClick}
          checked={checked ?? internalChecked}
          disabled={disabled}
        />
        <label
          htmlFor={`switch-${inputKey.current}`}
          className="switchCasing block overflow-hidden h-[22px] rounded-full bg-[#217EFD] cursor-pointer"
        ></label>
      </div>
      <label
        htmlFor={`checkbox-${inputKey.current}`}
        className="switchLabel select-none"
      >
        {label}
      </label>
    </div>
  );
};
