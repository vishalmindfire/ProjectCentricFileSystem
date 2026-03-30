import { useState} from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@components/Header';
import Footer from '@components/Footer';
import Sidebar from '@components/Sidebar';
import layoutModule from '@styles/layout.module.css';
export default function Layout() {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);

  const showHideMenu = (show : boolean) => {
    setIsMenuCollapsed(show);
  }
  return (
    <div className={layoutModule.appContainer}>
      <Header showHideMenu={showHideMenu} isHidden={isMenuCollapsed}/>
      <Sidebar isMenuCollapsed={isMenuCollapsed}/>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}