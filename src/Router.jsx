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
import HotelDetailPage from "./pages/HotelDetailPage";
import MyPointsPage from "./pages/MyPointsPage";
import MyTripsOverviewPage from "./pages/MyTripsOverviewPage";
import MyTripsDetailPage from "./pages/MyTripsDetailPage";
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
import OverviewReviewsPage from './pages/OverviewReviewsPage';
import StaffReviewPage from "./pages/StaffReviewPage";
import ThankYouPage from "./pages/ThankYouPage";
import FeatureDetailPage from "./pages/FeatureDetailPage";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/register" replace />;
  }
  return children;
};

const AppLayout = () => {
  const location = useLocation();

  const isAuthPage = [
    "/login",
    "/login-screen",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/set-new-password",
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
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route path="/review" element={<AccessibilityFeedback />} />
        <Route path="/hotels/:id/feature/:feature" element={<FeatureDetailPage />} />

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
          path="/hotels/:id"
          element={
            <ProtectedRoute>
              <HotelDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurants/:id"
          element={
            <ProtectedRoute>
              <HotelDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activities/:id"
          element={
            <ProtectedRoute>
              <HotelDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-trips-overview"
          element={
            <ProtectedRoute>
              <MyTripsOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip-details/:tripId"
          element={
            <ProtectedRoute>
              <MyTripsDetailPage />
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
          path="/my-reviews"
          element={
            <ProtectedRoute>
              <OverviewReviewsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-points"
          element={
            <ProtectedRoute>
              <MyPointsPage />
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
        <Route
          path="/review/parking/:id"
          element={
            <ProtectedRoute>
              <ParkingReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/entrance/:id"
          element={
            <ProtectedRoute>
              <EntranceReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/internal/:id"
          element={
            <ProtectedRoute>
              <InternalReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/sanitary/:id"
          element={
            <ProtectedRoute>
              <SanitaryReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/staff/:id"
          element={
            <ProtectedRoute>
              <StaffReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/thank-you"
          element={
            <ProtectedRoute>
              <ThankYouPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!isAuthPage}
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