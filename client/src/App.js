import "./App.css";
import { Routes, Route } from "react-router-dom";
import React from "react";
import MainPage from "./Pages/Main/MainPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterPage from "./Pages/Main/RegisterPage/RegisterPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;
