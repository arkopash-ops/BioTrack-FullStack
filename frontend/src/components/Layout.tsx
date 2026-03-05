import type { ReactNode } from "react";
import AnimatedBackground from "./AnimatedBackground";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <AnimatedBackground />
      <Navbar/>
      {children}
    </>
  );
};

export default Layout;
