import React, { FC, SVGAttributes } from "react";

export interface RefreshIconProps extends SVGAttributes<SVGSVGElement> {}

export const RefreshIcon: FC<RefreshIconProps> = ({
  ...componentProps
}: RefreshIconProps) => {
  return (
    <svg
      width="16"
      height="16"
      {...componentProps}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6663 7.99992C14.6663 11.6799 11.6797 14.6666 7.99967 14.6666C4.31967 14.6666 2.07301 10.9599 2.07301 10.9599M2.07301 10.9599H5.08634M2.07301 10.9599V14.2933M1.33301 7.99992C1.33301 4.31992 4.29301 1.33325 7.99967 1.33325C12.4463 1.33325 14.6663 5.03992 14.6663 5.03992M14.6663 5.03992V1.70659M14.6663 5.03992H11.7063"
        className="refreshInner stroke-black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
