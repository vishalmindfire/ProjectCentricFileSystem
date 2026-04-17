import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import cx from 'classnames';
import Header from '@components/Header';
import Footer from '@components/Footer';
import Sidebar from '@components/Sidebar';
import layoutModule from '@styles/layout.module.css';
import { AuthProvider } from '@contexts/AuthContext';
import { useAuth } from '@hooks/useAuth';

export default function Layout() {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const setCollapse = async () => {
      await setIsMenuCollapsed(true);
    };
    if (!isAuthenticated) {
      setCollapse();
    }
  }, [isAuthenticated]);
  return (
    <AuthProvider>
      <div className={layoutModule.appContainer}>
        <Header
          showHideMenu={() => {
            setIsMenuCollapsed(!isMenuCollapsed);
          }}
          isHidden={isMenuCollapsed}
        />
        <Sidebar isMenuCollapsed={isMenuCollapsed} />
        <main
          className={cx(layoutModule.main, {
            [layoutModule.mainFull]: isMenuCollapsed,
          })}
        >
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
