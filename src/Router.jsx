import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LoginScreen from "./pages/LoginScreen";
import TripPlannerPage from "./pages/TripPlannerPage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HotelDetailPage from "./pages/HotelDetailPage";
import PointsPage from "./pages/PointsPage";
import MyTrips from "./pages/MyTripsPage";
import AccessibilityFeedback from "./pages/reviews";
import RegisterScreen from "./pages/RegisterScreen";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";

import WriteReviewPage from "./pages/WriteReviewPage";


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/register" replace />;
  }

  return children;
};

const AppLayout = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/login-screen" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password"; // ✅ added this line

  return (
    <>
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login-screen" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip-planner"
          element={
            <ProtectedRoute>
              <TripPlannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/place-detail/:id"
          element={
            <ProtectedRoute>
              <HotelDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/points"
          element={
            <ProtectedRoute>
              <PointsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-trips"
          element={
            <ProtectedRoute>
              <MyTrips />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <AccessibilityFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/write-review"
          element={
            <ProtectedRoute>
              <WriteReviewPage />
            </ProtectedRoute>
          }
        />
                <Route
                  path="/pricing"
                  element={
                    <ProtectedRoute>
                      <Pricing />
                    </ProtectedRoute>
                  }
                />
      </Routes>

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
