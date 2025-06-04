import "../styles/login.css"; 
import LoginCard from "../components/Cards/LoginCard";

const LoginPage = () => {
  const loginImage = "./assets/images/loginImage2.png"; 

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-background">
          <img src={loginImage} alt="Login Background" />
        </div>

-        <div className="login-content">
          <LoginCard />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
