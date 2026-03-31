import headerModule from "@styles/header.module.css";
import { useNavigate } from "react-router";
interface HeaderProps {
  showHideMenu: (show: boolean) => void;
  isHidden: boolean;
  title?: string;
}

const Header = ({
  showHideMenu,
  isHidden,
  title = "Project Centric File System",
}: HeaderProps) => {
  const navigate = useNavigate();
  const handleMenuCollapseClick = () => {
    showHideMenu(!isHidden);
  };
  const logInClickHandler = () => {
    navigate("/login", { replace: true });
  };
  return (
    <header className={headerModule.header}>
      <div className={headerModule.headerContainer}>
        <span className={headerModule.logo} onClick={handleMenuCollapseClick}>
          PCFS
        </span>
        <h1 className={headerModule.headerTitle}>{title}</h1>
        <span onClick={logInClickHandler}>Login</span>
      </div>
    </header>
  );
};

export default Header;
