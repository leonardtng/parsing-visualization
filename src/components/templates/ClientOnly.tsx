import React, { useState, useEffect, FC, HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ClientOnly: FC<Props> = ({ children, ...componentProps }: Props) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return <div {...componentProps}>{children}</div>;
};

export default ClientOnly;
