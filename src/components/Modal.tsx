import modalModule from '@styles/modal.module.css';
import InputBox from '@components/InputBox';
import cx from 'classnames';

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
      <div
        className={cx(modalModule.modalBoxContent, {
          [modalModule.confirmBoxContent]: props.type === 'confirm',
          [modalModule.messageBoxContent]: props.type === 'message',
        })}
      >
        <header className={modalModule.modalBoxHeader}>
          <span className={modalModule.modalBoxTitle}>
            {props.type === 'message' ? 'Message' : props.title}
          </span>
          <button onClick={props.onClose} className={modalModule.modalCloseButton}>
            ✖
          </button>
        </header>
        <div className={modalModule.modalBody}>
          {props.children}
          {props?.type === 'confirm' && (
            <InputBox type="submit" value="Confirm" onClick={props.onSubmit} />
          )}
          {props?.type === 'message' && (
            <InputBox type="submit" value="OK" onClick={props.onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
