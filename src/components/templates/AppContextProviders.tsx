import React, { FC, ReactNode } from "react";
import { ParsingContextProvider } from "@/components";

interface Props {
  children: ReactNode;
}

const AppContextProviders: FC<Props> = ({ children }: Props) => {
  return <ParsingContextProvider>{children}</ParsingContextProvider>;
};

export default AppContextProviders;
