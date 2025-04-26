import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "../components/Buttons/PrimaryButton";

// Full country list
const countryList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada",
  "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "North Korea",
  "South Korea", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
  "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
  "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
  "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const RegisterScreen = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    country: "",
    postcode: "",
    city: "",
    street: "",
    houseNumber: "",
    phoneNumber: "",
    gender: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setEmailError(false);
    setPasswordError(false);

    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      country,
      postcode,
      city,
      street,
      houseNumber,
      phoneNumber,
      gender,
    } = formData;

    if (password.length < 6) {
      setPasswordError(true);
      setError("Password must have more than 5 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError(true);
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("https://roamly-api.onrender.com/api/v1/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          country,
          postcode,
          city,
          street,
          houseNumber,
          phoneNumber,
          gender,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message && data.message.toLowerCase().includes("e-mail is al geregistreerd")) {
          setEmailError(true);
          setError("E-mail is already taken.");
        } else {
          setError(data.message || "Registration failed.");
        }
        return;
      }

      // ✅ Save token immediately after successful registration
      const token = data?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      } else {
        throw new Error("No token received from server.");
      }

      setSuccessMessage("Registration successful!");

      // ✅ Navigate to profile after short delay
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="register-page-wrapper">
      <div className="register-image-wrapper">
        <img src="/assets/images/loginimage.png" alt="Register background" />
      </div>

      <div className="register-form-wrapper">
        <div className="register-screen-container">
          <button className="back-button" onClick={() => navigate(-1)}>←</button>
          <h1 className="register-heading">Create your account</h1>

          <form className="register-form" onSubmit={handleRegister}>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required className={emailError ? "input-error" : ""} />

            <div className="input-row">
              <div className="input-group">
                <label>First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <label>Country</label>
            <select name="country" value={formData.country} onChange={handleChange} required>
              <option value="">Select your country</option>
              {countryList.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <div className="input-row">
              <div className="input-group">
                <label>Postcode</label>
                <input type="text" name="postcode" value={formData.postcode} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Street</label>
                <input type="text" name="street" value={formData.street} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>House Number</label>
                <input type="text" name="houseNumber" value={formData.houseNumber} onChange={handleChange} required />
              </div>
            </div>

            <label>Phone Number</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />

            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <label>Password</label>
            <div className="password-wrapper">
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required className={passwordError ? "input-error" : ""} />
              <FontAwesomeIcon icon={faEye} className="toggle-password" />
            </div>

            <label>Confirm Password</label>
            <div className="password-wrapper margin-bottom-lg">
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required className={passwordError ? "input-error" : ""} />
              <FontAwesomeIcon icon={faEye} className="toggle-password" />
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="full-width-button">
              <PrimaryButton text="Register" type="submit" />
            </div>

            <div className="divider">
              <span>Or register with</span>
            </div>

            <button className="google-login-button">
              <img src="/assets/icons/googleIcon.svg" alt="Google login" />
            </button>
          </form>

          <p className="bottom-prompt">
            Already have an account?{" "}
            <span className="redirect-link" onClick={() => navigate("/login-screen")}>Login now</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
