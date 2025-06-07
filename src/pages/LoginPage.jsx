import "../styles/login.css"; 
import LoginCard from "../components/Cards/LoginCard";

const LoginPage = () => {
  const loginImage = "./assets/images/loginImage.png"; 

  return (
    <div className="login-page-wrapper">
      <div className="login-image-wrapper">
          <img src={loginImage} alt="Login Background" />
        </div>
      <div className="login-form-wrapper">
        <div className="login-screen-container">

          <LoginCard />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
