import { AuthContext } from '@contexts/AuthContext';
import { useAuth } from '@hooks/useAuth';
import { logout } from '@services/authService';
import headerModule from '@styles/header.module.css';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import cx from 'classnames';

interface HeaderProps {
  showHideMenu: () => void;
  isHidden: boolean;
  title?: string;
}

const Header = ({ showHideMenu, isHidden, title = 'Project Centric File System' }: HeaderProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { dispatch } = useContext(AuthContext);

  const logInClickHandler = () => {
    navigate('/login');
  };
  const logoutClickHandler = async () => {
    const response = await logout(dispatch);
    if (response) {
      navigate('/');
    }
  };
  return (
    <header className={headerModule.header}>
      <div className={headerModule.headerContainer}>
        <div className={cx(headerModule.headerRow, { [headerModule.collapse]: isHidden === true })}>
          <div
            className={headerModule.headerTitle}
            onClick={() => {
              if (isAuthenticated) {
                showHideMenu();
              }
            }}
          >
            PCFS
          </div>
          <div className={headerModule.headerMenu}>{title}</div>
          <div className={headerModule.headerUser}>
            {!isAuthenticated && <span onClick={logInClickHandler}>Login</span>}
            {isAuthenticated && <span onClick={logoutClickHandler}>Logout</span>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
