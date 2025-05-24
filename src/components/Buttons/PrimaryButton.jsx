import { Link } from "react-router-dom";
import "./Buttons.css"; 

const PrimaryButton = ({ text, onClick, to, variant = "primary" }) => {
  const buttonClass = `btn ${variant === "secondary"
      ? "register-btn"
      : variant === "guest"
        ? "guest-btn"
        : "login-btn"
    }`;


  if (to) {
    return (
      <Link to={to} className={buttonClass} onClick={onClick}>
        {text}
      </Link>
    );
  }

  return (
    <button className={buttonClass} onClick={onClick}>
      {text}
    </button>
  );
};

export default PrimaryButton;
