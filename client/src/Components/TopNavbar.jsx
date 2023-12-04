// TopNavbar.js

import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useAuth } from "../Contexts/AuthContext"; // Import useAuth hook
import "./TopNavbar.css";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

function TopNavbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth(); // Access user information from useAuth hook

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    // Call the logout function from the authentication context
    logout();
  };

  return (
    <Navbar
      className={`bg-${isDarkMode ? "dark" : "body-tertiary"} mb-5`}
      variant={isDarkMode ? "dark" : "light"}
    >
      <Container>
        <Navbar.Brand href="/">
          <img
            src="assets/images/nav.png"
            alt="logo"
            style={{ height: "100px", width: "200px" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <MdOutlineLightMode />
          </Navbar.Text>
          <Navbar.Text>
            <section className="container mb-4 pb-3">
              <div className="row">
                <div className="col-xs-12">
                  <div className="form-check">
                    <label className="form-check-label form-check-toggle">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                      />
                      <span></span>
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </Navbar.Text>
          <Navbar.Text>
            <MdOutlineDarkMode />
          </Navbar.Text>
          {user ? (
            <DropdownButton
              title={
                <span>
                  Logged in as{" "}
                  <strong style={{ color: "blue" }}>{user.userName}</strong>
                </span>
              }
              id="dropdown-menu-align-right"
              variant={isDarkMode ? "dark" : "light"}
            >
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </DropdownButton>
          ) : (
            <Navbar.Text>
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </Navbar.Text>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
