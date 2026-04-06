import { AuthContext } from '@contexts/AuthContext';
import { useAuth } from '@hooks/useAuth';
import { logout } from '@services/authService';
import headerModule from '@styles/header.module.css';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
interface HeaderProps {
  showHideMenu: (show: boolean) => void;
  isHidden: boolean;
  title?: string;
}

const Header = ({ showHideMenu, isHidden, title = 'Project Centric File System' }: HeaderProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { dispatch } = useContext(AuthContext);
  const handleMenuCollapseClick = () => {
    showHideMenu(!isHidden);
  };
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
        <span className={headerModule.logo} onClick={handleMenuCollapseClick}>
          PCFS
        </span>
        <h1 className={headerModule.headerTitle}>{title}</h1>
        {!isAuthenticated && <span onClick={logInClickHandler}>Login</span>}
        {isAuthenticated && <span onClick={logoutClickHandler}>Logout</span>}
      </div>
    </header>
  );
};

export default Header;
