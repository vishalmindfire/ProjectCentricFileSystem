import headerModule from '@styles/header.module.css';
interface HeaderProps {
    showHideMenu: (show:boolean) => void;
    isHidden: boolean;
    title?: string;
}

const Header= ({ showHideMenu, isHidden, title = 'Project Centric File System' } : HeaderProps) => {
    const handleClick = () => {
        showHideMenu(!isHidden);
    }
    return (
        <header className={headerModule.header}>
            <div className={headerModule.headerContainer}>
                <span className={headerModule.logo} onClick={handleClick}>PCFS</span>
                <h1 className={headerModule.headerTitle}>{title}</h1>
                <span>Login</span>
            </div>
        </header>
    );
};

export default Header;