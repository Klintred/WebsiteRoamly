import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/resetpassword.css";
import PrimaryButton from "../components/Buttons/PrimaryButton";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  // On component mount, get email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      setError("Email context missing. Please restart the reset process.");
    } else {
      setEmail(storedEmail);
    }

    // Autofocus first input
    const firstInput = document.getElementById("code-0");
    if (firstInput) firstInput.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("Text").trim();
    if (!/^\d{6}$/.test(pasted)) {
      setError("Please paste a valid 6-digit code.");
      return;
    }

    const pastedArray = pasted.split("").slice(0, 6);
    setCode(pastedArray);

    const lastInput = document.getElementById(`code-${pastedArray.length - 1}`);
    if (lastInput) lastInput.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (!email) {
      setError("Email context missing. Please restart the reset process.");
      return;
    }

    if (fullCode.length !== 6 || code.includes("")) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("https://roamly-api.onrender.com/api/v1/users/verify-reset-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, resetPasswordCode: fullCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid or expired code.");
      }

      localStorage.setItem("verifiedEmail", email);
      localStorage.setItem("verifiedCode", fullCode);

      navigate("/set-new-password");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page-wrapper">
      <div className="reset-image-wrapper">
        <img src="/assets/images/loginimage.png" alt="Reset background" />
      </div>

      <div className="reset-form-wrapper">
        <div className="reset-screen-container">
          <button className="back-button" onClick={() => navigate(-1)}>←</button>

          <h1 className="reset-heading">Verification code</h1>
          <p className="subheading-text">Enter the 6-digit code sent to your email.</p>

          <form className="reset-form" onSubmit={handleSubmit}>
            <div className="code-input-row">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength="1"
                  className="code-input"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onPaste={handlePaste}
                />
              ))}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="full-width-button">
              <PrimaryButton
                text={loading ? "Verifying..." : "Verify"}
                type="submit"
                disabled={loading}
              />
            </div>
          </form>

          <div className="bottom-login-redirect">
            Remember password?{" "}
            <span className="login-link" onClick={() => navigate("/login-screen")}>
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
