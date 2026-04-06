import cx from 'classnames';
import sidebarModule from '@styles/sidebar.module.css';
import { useNavigate } from 'react-router';

type sidebarProps = {
  isMenuCollapsed: boolean;
};

const Sidebar = ({ isMenuCollapsed }: sidebarProps) => {
  const navigate = useNavigate();

  const menuClasses = cx(sidebarModule.menu, {
    [sidebarModule.menuCollapsed]: isMenuCollapsed,
  });
  return (
    <aside className={menuClasses}>
      <nav className={sidebarModule.menuContainer}>
        <ul className={sidebarModule.menuList}>
          <li>
            <a
              onClick={() => {
                navigate('/');
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                navigate('/projects');
              }}
            >
              Projects
            </a>
          </li>
          <li>
            <a href="/settings">Settings</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
