import React, { FC, HTMLAttributes, ReactNode } from "react";
import { DocumentHead } from "@/components";
import { App } from "@/types";
import { useWindowSize } from "@/helpers";

interface Props extends HTMLAttributes<HTMLDivElement> {
  app: App;
  center?: boolean;
  children: ReactNode;
}

const PageTemplate: FC<Props> = ({
  app,
  center = false,
  children,
  className,
  ...componentProps
}: Props) => {
  const [_, winHeight] = useWindowSize();

  return (
    <div
      {...componentProps}
      className={`relative bg-background flex flex-col w-full items-center 
      transition-colors ease-in-out duration-700
      ${center ? "justify-center" : "justify-start"} ${className}`}
      style={{
        minHeight: winHeight || "100vh",
      }}
    >
      <DocumentHead app={app} />
      {children}
    </div>
  );
};

export default PageTemplate;
