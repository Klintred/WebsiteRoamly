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
import ResetPassword from "./pages/ResetPassword";
import SetNewPassword from "./pages/SetNewPassword"; 
import WriteReviewPage from "./pages/WriteReviewPage";
import ParkingReviewPage from './pages/ParkingReviewPage';
import EntranceReviewPage from './pages/EntranceReviewPage';
import InternalReviewPage from './pages/InternalReviewPage';
import SanitaryReviewPage from './pages/SanitaryReviewPage';

// ✅ Middleware to protect private routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/register" replace />;
  }
  return children;
};

// ✅ Layout with conditional Nav/Footer
const AppLayout = () => {
  const location = useLocation();

  const isAuthPage = [
    "/login",
    "/login-screen",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/set-new-password", // ✅ Added here
  ].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login-screen" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/set-new-password" element={<SetNewPassword />} /> {/* ✅ Added */}

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
        <Route path="/review/parking/:id" element={
          <ProtectedRoute>
            <ParkingReviewPage />
          </ProtectedRoute>

        } />
         <Route path="/review/entrance/:id" element={
          <ProtectedRoute>
            <EntranceReviewPage />
          </ProtectedRoute>

        } />
         <Route path="/review/internal/:id" element={
          <ProtectedRoute>
            <InternalReviewPage />
          </ProtectedRoute>

        } />
        <Route path="/review/sanitary/:id" element={
          <ProtectedRoute>
            <SanitaryReviewPage />
          </ProtectedRoute>

        } />
        
      </Routes>

      {!isAuthPage && <Footer />}
    </>
  );
};

// ✅ Main router wrapper
const AppRouter = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default AppRouter;
