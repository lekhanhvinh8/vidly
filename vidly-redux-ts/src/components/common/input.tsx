interface Props {
  name: string;
  label: string;
  errorMessage: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

const Input: React.FC<Props> = ({
  name,
  label,
  errorMessage,
  onInputChange,
  ...rest
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="control-label">
        {label}
      </label>
      <input
        {...rest}
        name={name}
        className="form-control"
        id={name}
        onChange={onInputChange}
      />
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
    </div>
  );
};

export default Input;
