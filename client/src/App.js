import "./App.css";
import { Routes, Route } from "react-router-dom";
import React from "react";
import MainPage from "./Pages/Main/MainPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterPage from "./Pages/Main/RegisterPage/RegisterPage";
import LoginPage from "./Pages/Main/LoginPage/LoginPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;
