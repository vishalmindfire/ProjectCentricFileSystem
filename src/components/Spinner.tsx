import spinnerModule from '@styles/spinner.module.css';

const Spinner = () => {
  return (
    <div className={spinnerModule.loaderBody}>
      <div className={spinnerModule.loader}></div>
    </div>
  );
};
export default Spinner;
