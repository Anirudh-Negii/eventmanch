import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({ label, id, className = "", ...inputProps }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...inputProps}
          id={id}
          type={visible ? "text" : "password"}
          className={`field pr-12 ${className}`}
        />
        <button
          type="button"
          onClick={() => setVisible((isVisible) => !isVisible)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-ink/45 transition hover:text-coral"
        >
          {visible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
