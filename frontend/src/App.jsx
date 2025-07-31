import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LandingPage from "./pages/landingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AuthProvider from "./context/AuthProvider";
import ProtectedRoute from "./utils/ProtectedRoute";
import RedirectRoute from "./utils/redirect";
import All from "./pages/All";


function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <RedirectRoute>
                  <LandingPage />
                </RedirectRoute>
              }
            ></Route>

            <Route
              path="/Home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/AllTasks"
              element={
                <ProtectedRoute>
                  <All />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/login"
              element={
                <RedirectRoute>
                    <SignIn />
                </RedirectRoute>
              }
            ></Route>

            <Route path="/register" element={<SignUp />}></Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
