import { type InputHTMLAttributes } from "react";
import cx from "classnames";
import inputBoxModule from "@styles/inputBox.module.css";
interface InputBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  type: string;
}

const InputBox = ({ label, error, ...props }: InputBoxProps) => {
  const inputClasses = cx(inputBoxModule.inputBoxInput, {
    [inputBoxModule.inputBoxButton]: props.type === "submit",
  });
  return (
    <div className={inputBoxModule.inputBox}>
      {label && (
        <label htmlFor={props.id} className={inputBoxModule.inputBoxLabel}>
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && <div className={inputBoxModule.inputBoxError}>{error}</div>}
    </div>
  );
};

export default InputBox;
