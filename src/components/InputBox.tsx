import React from 'react';
import { type InputHTMLAttributes } from 'react';
import cx from 'classnames';
import inputBoxModule from '@styles/inputBox.module.css';
interface InputBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  type: string;
  modal?: boolean;
}

const InputBox = React.forwardRef<HTMLInputElement, InputBoxProps>(
  ({ label, error, ...props }, ref) => {
    const inputClasses = cx(inputBoxModule.inputBoxInput, {
      [inputBoxModule.inputBoxButton]: props.type === 'button',
      [inputBoxModule.inputBoxSubmit]: props.type === 'submit',
      [inputBoxModule.inputBoxModal]: props.modal === true,
    });
    return (
      <div className={inputBoxModule.inputBoxWrapper}>
        <div className={inputBoxModule.inputBox}>
          {label && (
            <label htmlFor={props.id} className={inputBoxModule.inputBoxLabel}>
              {label}
            </label>
          )}
          <input className={inputClasses} ref={ref} {...props} />
        </div>
        {error && <div className={inputBoxModule.inputBoxError}>{error}</div>}
      </div>
    );
  }
);

export default InputBox;
