import { Link } from "react-router-dom";
import "./Buttons.css"; // Import button styles

const PrimaryButton = ({ text, onClick, to, variant = "primary" }) => {
  const buttonClass = `btn ${
    variant === "secondary"
      ? "register-btn"
      : variant === "guest"
      ? "guest-btn"
      : "login-btn"
  }`;


  // If a 'to' prop is passed, render a <Link> for navigation
  if (to) {
    return (
      <Link to={to} className={buttonClass} onClick={onClick}>
        {text}
      </Link>
    );
  }

  // Otherwise, render a regular <button>
  return (
    <button className={buttonClass} onClick={onClick}>
      {text}
    </button>
  );
};

export default PrimaryButton;
