import "./App.css";
import { AuthContextProvider, useAuth } from "./Contexts/AuthContext";
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./Pages/Main/MainPage";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./Pages/Main/LoginPage/LoginPage";
import RegistrationForm from "./Pages/Main/RegisterPage/RegisterPage";
import { DarkModeProvider } from "./Contexts/DarkModeContext";

function App() {
  const { user, login } = useAuth();
  useEffect(() => {
    const userJSON = sessionStorage.getItem("user");
    if (userJSON) {
      const userData = JSON.parse(userJSON);
      login(userData);
    }
  }, []);

  const isAuthenticated = (allowedRoles) => {
    if (user === null) return false;
    return allowedRoles.includes(user.role);
  };
  return (
    <div className="App">
      <DarkModeProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      </DarkModeProvider>
    </div>
  );
}

const AppWithAuthContext = () => (
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);

export default AppWithAuthContext;
