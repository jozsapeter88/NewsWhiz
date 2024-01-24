import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link, useNavigate  } from "react-router-dom";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useAuth } from "../Contexts/AuthContext";
import "./TopNavbar.css";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useDarkMode } from "../Contexts/DarkModeContext";

function TopNavbar() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    logout();
    handleCloseLogoutModal();
    navigate("/login");
  };

  const handleShowLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false);
  };

  return (
    <Navbar
      className={`bg-${isDarkMode ? "dark" : "body-tertiary"} mb-5`}
      variant={isDarkMode ? "dark" : "light"}
    >
      <Container>
        <Navbar.Brand href="/">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/nav.png`}
            alt="logo"
            style={{ height: "100px", width: "200px" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {user ? (
            <>
              <Navbar.Text>
                <Link to="/bookmarks" className="nav-link bookmarkBtn">
                  Bookmarks
                </Link>
              </Navbar.Text>
            </>
          ) : (
            <Navbar.Text></Navbar.Text>
          )}
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
            <>
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
                <Dropdown.Item
                  onClick={handleShowLogoutModal}
                  variant={isDarkMode ? "dark" : "light"}
                >
                  Logout
                </Dropdown.Item>
              </DropdownButton>
            </>
          ) : (
            <Navbar.Text className="loginBtn">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </Navbar.Text>
          )}
        </Navbar.Collapse>
      </Container>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={handleCloseLogoutModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogoutModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
}

export default TopNavbar;
