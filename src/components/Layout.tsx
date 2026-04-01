import { useState } from "react";
import { Outlet } from "react-router-dom";
import cx from "classnames";
import Header from "@components/Header";
import Footer from "@components/Footer";
import Sidebar from "@components/Sidebar";
import layoutModule from "@styles/layout.module.css";
import { AuthProvider } from "@contexts/AuthContext";

export default function Layout() {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
  const mainClasses = cx(layoutModule.main, {
    [layoutModule.mainFull]: useState(isMenuCollapsed),
  });
  const showHideMenu = (show: boolean) => {
    setIsMenuCollapsed(show);
  };
  return (
    <AuthProvider>
      <div className={layoutModule.appContainer}>
        <Header showHideMenu={showHideMenu} isHidden={isMenuCollapsed} />
        <Sidebar isMenuCollapsed={isMenuCollapsed} />
        <main className={mainClasses}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
