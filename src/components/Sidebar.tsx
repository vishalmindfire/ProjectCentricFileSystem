import cx from  'classnames';
import sidebarModule from '@styles/sidebar.module.css';

type sidebarProps = {
    isMenuCollapsed : boolean
}
const Sidebar = (sidebarProps : sidebarProps) => {
    const menuClasses = cx(
        sidebarModule.menu,
        {[sidebarModule.menuCollapsed] : sidebarProps.isMenuCollapsed}
    )
    return (
        <aside className={menuClasses}>
            <nav className={sidebarModule.menuContainer}>
                <ul className={sidebarModule.menuList}>
                    <li><a href="/">Home</a></li>
                    <li><a href="/projects">Projects</a></li>
                    <li><a href="/files">Files</a></li>
                    <li><a href="/settings">Settings</a></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;