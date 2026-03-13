import type { ReactNode } from "react";
import Background from "./Background";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Background />
      <Navbar/>
      {children}
    </>
  );
};

export default Layout;
