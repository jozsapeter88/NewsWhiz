import "./App.css";
import { Routes, Route } from "react-router-dom";
import React from "react";
import MainPage from "./Pages/Main/MainPage";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />

      </Routes>
    </div>
  );
}

export default App;
