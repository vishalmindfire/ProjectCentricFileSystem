import modalModule from '@styles/modal.module.css';
import InputBox from './InputBox';


interface ModalProps {
    title: string;
    onClose?: () => void;
    onSubmit?: () => void;
    children: React.ReactNode;
    type?: string;
    open?: string;
}

const Modal = (props: ModalProps) => {
return (
        <div id="modal-box" className={modalModule.modalBox}>
            <div className={modalModule.modalBoxContent}>
                <header className={modalModule.modalBoxHeader}>
                <span className={modalModule.modalBoxTitle}>{props.title}</span>
                <button onClick={props.onClose} className={modalModule.modalCloseButton}>✖</button>
                </header>
                <div className={modalModule.modalBody}>
                    {props.children}
                    { props?.type === "confirm" && 
                        <InputBox type="submit" value="Confirm" onClick={props.onSubmit}/>}
                </div>
            </div>
        </div>
    );
};

export default Modal;

