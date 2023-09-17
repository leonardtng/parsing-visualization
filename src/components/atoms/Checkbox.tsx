import React, { FC, HTMLAttributes, useRef, useState } from "react";

export interface CheckboxProps extends HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  label?: string;
  labelReverse?: boolean;
  iconColor?: string;
  disabled?: boolean;
}

export const Checkbox: FC<CheckboxProps> = ({
  checked,
  label,
  labelReverse = false,
  iconColor = "#000000",
  className,
  onChange,
  disabled = false,
  ...componentProps
}: CheckboxProps) => {
  const inputKey = useRef<number | string>(
    componentProps.id ?? label ?? Math.random() * 100
  );

  const [internalChecked, setInternalChecked] = useState<boolean>(
    checked ?? false
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalChecked(event.target.checked);
    if (onChange) onChange(event);
  };

  return (
    <div {...componentProps} className={`checkboxRoot w-fit ${className}`}>
      <div
        className={`checkboxInner flex items-center ${
          labelReverse ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`checkboxBase bg-background 
          border border-strokePrimary rounded-md 
          w-4 h-4 flex flex-shrink-0 justify-center items-center ${
            !label ? "m-0" : labelReverse ? "ml-2" : "mr-2"
          } focus-within:fill-fontPrimary`}
        >
          <input
            type="checkbox"
            id={`checkbox-${inputKey.current}`}
            name="checkbox-confirmation"
            checked={checked ?? internalChecked}
            value="yes"
            className="checkboxInput opacity-0 absolute h-4 w-4 cursor-pointer disabled:cursor-not-allowed peer"
            onChange={!disabled ? handleChange : undefined}
            disabled={disabled}
          />
          <svg
            className="checkIcon fill-current hidden peer-checked:block w-[10px] h-[10px] pointer-events-none"
            version="1.1"
            viewBox="0 0 17 12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" fillRule="evenodd">
              <g
                transform="translate(-9 -11)"
                fill={iconColor}
                fillRule="nonzero"
                data-cy="checkInner"
              >
                <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
              </g>
            </g>
          </svg>
        </div>
        <label
          htmlFor={`checkbox-${inputKey.current}`}
          className="checkboxLabel select-none"
        >
          {label}
        </label>
      </div>
    </div>
  );
};
