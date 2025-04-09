import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LoginScreen from "./pages/LoginScreen";
import TripPlannerPage from "./pages/TripPlannerPage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HotelDetailPage from './pages/HotelDetailPage';  
import PointsPage from './pages/PointsPage';  
import MyTrips from './pages/MyTripsPage';
import AccessibilityFeedback from "./pages/reviews";
import RegisterScreen from "./pages/RegisterScreen"; 


const AppLayout = () => {
  const location = useLocation();

  // Hide Navbar and Footer on both login routes
  const isAuthPage = location.pathname === "/login" || location.pathname === "/login-screen" || location.pathname === "/register";

  return (
    <>
      {/* Only show Navbar if NOT on login or login-screen */}
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/place-detail/:id" element={<HotelDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login-screen" element={<LoginScreen />} />
        <Route path="/trip-planner" element={<TripPlannerPage />} />
        <Route path="/points" element={<PointsPage />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/reviews" element={<AccessibilityFeedback />} />
        <Route path="/register" element={<RegisterScreen />} />
      </Routes>

      {/* Only show Footer if NOT on login or login-screen */}
      {!isAuthPage && <Footer />}
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
