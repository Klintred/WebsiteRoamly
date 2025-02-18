import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

const AppLayout = () => {
  const location = useLocation(); // Get the current route

  // Check if the current route is the login page
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {/* Only show Navbar if NOT on the login page */}
      {!isLoginPage && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      {/* Only show Footer if NOT on the login page */}
      {!isLoginPage && <Footer />}
    </>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default AppRouter;
