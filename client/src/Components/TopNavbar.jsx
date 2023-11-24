import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import { useState, useEffect } from "react";
import "./TopNavbar.css";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";

function TopNavbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <Navbar
      className={`bg-${isDarkMode ? "dark" : "body-tertiary"} mb-5`}
      variant={isDarkMode ? "dark" : "light"}
    >
      <Container>
        <Navbar.Brand href="#">
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
            {/* Dark-Light Mode Switch */}
            <section class="container mb-4 pb-3">
              <div class="row">
                <div class="col-xs-12">
                  <div class="form-check">
                    <label class="form-check-label form-check-toggle">
                      <input
                        class="form-check-input"
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
