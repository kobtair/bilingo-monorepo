import { Routes, Route, useLocation } from "react-router-dom"
import { useUserStore } from "./store/User/user"
import { AnimatePresence } from "framer-motion"
import WelcomePage from "./pages/WelcomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import CourseSelectionPage from "./pages/CourseSelectionPage"
import HomePage from "./pages/HomePage"
import LessonsPage from "./pages/LessonsPage"
import LessonDetailPage from "./pages/LessonDetailPage"
import ProgressPage from "./pages/ProgressPage"
import PracticePage from "./pages/PracticePage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ProfilePage from "./pages/ProfilePage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import TermsPage from "./pages/TermsPage"
import PrivateRoute from "./components/PrivateRoute"
import PublicRoute from "./components/PublicRoute"
import AnimatedPage from "./components/AnimatedPage"

function App() {
  const { user } = useUserStore()
  const location = useLocation()

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-400" style={{ overflow: "hidden", minHeight: "100vh", position: "relative" }}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route element={<PublicRoute user={user} />}>
            <Route
              path="/"
              element={
                <AnimatedPage>
                  <WelcomePage />
                </AnimatedPage>
              }
            />
            <Route
              path="/login"
              element={
                <AnimatedPage>
                  <LoginPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <AnimatedPage>
                  <ForgotPasswordPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/register"
              element={
                <AnimatedPage>
                  <RegisterPage />
                </AnimatedPage>
              }
            />
          </Route>

          {/* Private routes */}
          <Route element={<PrivateRoute user={user} />}>
            <Route
              path="/courses"
              element={
                <AnimatedPage>
                  <CourseSelectionPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/terms"
              element={
                <AnimatedPage>
                  <TermsPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/privacy-policy"
              element={
                <AnimatedPage>
                  <PrivacyPolicyPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/courses/:id"
              element={
                <AnimatedPage>
                  <LessonsPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/home"
              element={
                <AnimatedPage>
                  <HomePage />
                </AnimatedPage>
              }
            />
            <Route
              path="/lessons/:id"
              element={
                <AnimatedPage>
                  <LessonDetailPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/progress"
              element={
                <AnimatedPage>
                  <ProgressPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/practice"
              element={
                <AnimatedPage>
                  <PracticePage />
                </AnimatedPage>
              }
            />
            <Route
              path="/profile"
              element={
                <AnimatedPage>
                  <ProfilePage />
                </AnimatedPage>
              }
            />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App

