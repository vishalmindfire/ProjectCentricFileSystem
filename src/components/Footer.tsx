import footerModule from '@styles/footer.module.css';
const Footer = () => {

    return (
        <footer className={footerModule.footer}>
            <div className={footerModule.footerContainer}>
                <div>
                    <h3 className={footerModule.footerHeading}>About</h3>
                </div>
                <div>
                    <h3 className={footerModule.footerHeading}>Contact Us</h3>
                </div>
            </div>
        </footer>
    );
};

export default Footer;