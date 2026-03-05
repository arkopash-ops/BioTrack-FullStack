import type { ReactNode } from "react";
import AnimatedBackground from "./AnimatedBackground";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <AnimatedBackground />
      {children}
    </>
  );
};

export default Layout;
