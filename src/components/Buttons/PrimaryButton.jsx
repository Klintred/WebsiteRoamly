import { Link } from "react-router-dom";
import "./Buttons.css";

const PrimaryButton = ({ text, onClick, to, variant = "primary", children }) => {
  const buttonClass = `btn ${variant === "secondary"
    ? "register-btn"
    : variant === "guest"
      ? "guest-btn"
      : "login-btn"
    }`;
  const content = children || text;


  if (to) {
    return (
      <Link to={to} className={buttonClass} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
   <div className="button-container-wrapper">
      <button className={buttonClass} onClick={onClick}>
        {content}
      </button>
    </div>
  );
};

export default PrimaryButton;
