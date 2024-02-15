import React, { useState, useEffect } from "react";
import { Dropdown, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import TopNavbar from "../../../Components/TopNavbar";
import { useDarkMode } from "../../../Contexts/DarkModeContext";
import "./BookmarkId.css";
import { Link } from "react-router-dom";
import { IoCaretBack } from "react-icons/io5";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Button from "react-bootstrap/esm/Button";
import { useAuth } from "../../../Contexts/AuthContext";
import BookmarkTranslateModal from "./BookmarkTranslateModal";
import CustomSpinner from "../../../Components/CustomSpinner";

function BookmarkId() {
  const { user } = useAuth();
  const { id } = useParams();
  const loggedInUser = user ? user.id : null;
  const [bookmark, setBookmark] = useState(null);
  const { isDarkMode } = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [translatedText, setTranslatedText] = useState(null);
  const [summaryResult, setSummaryResult] = useState(null);
  const [summaryPercent, setSummaryPercent] = useState(100);
  const [selectedPercentage, setSelectedPercentage] = useState(100);
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [translationDisplayed, setTranslationDisplayed] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchBookmark = async () => {
      try {
        const response = await fetch(
          `http://localhost:5092/api/Bookmark/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setBookmark(data);
        } else {
          console.error("Error fetching bookmark:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching bookmark:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmark();
  }, [id]);

  const handleTranslateClick = () => {
    setShowModal(true);
  };

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setShowModal(false);
    translateText(languageCode);
  };

  const translateText = async (languageCode) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5092/api/Translation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: bookmark.text,
          sourceLanguage: "en",
          targetLanguage: languageCode.toLowerCase(),
        }),
      });
      console.log("API Response:", response.status, response.statusText);
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      if (response.ok) {
        setTranslatedText(responseData.translatedText);
        setTranslationDisplayed(true);
        console.log("Translation successful:", responseData.translatedText);
      } else {
        console.error("Error in Translation:", responseData.error);
      }
    } catch (error) {
      console.error("Error translating text:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveTranslatedText = async () => {
    try {
      const response = await fetch(`http://localhost:5092/api/Bookmark/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: translatedText,
          userId: loggedInUser,
        }),
      });

      if (response.ok) {
        console.log("Translated text saved successfully.");
        window.alert("Translated text saved successfully!");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Error saving translated text:", errorData.errors);
      }
    } catch (error) {
      console.error("Error saving translated text:", error);
    }
  };

  return (
    <>
      <TopNavbar />
      <div className="textHeader">
        <Link to="/bookmarks" style={{ top: 10, left: 10 }}>
          <Button className="back-button">
            <IoCaretBack />
          </Button>
        </Link>
        {loading && <CustomSpinner />}
        <h2 className="bookmarkName">
          {bookmark ? <p>{bookmark.name}</p> : <p>Loading...</p>}
        </h2>
        <div style={{ marginLeft: "auto", marginRight: "20vh" }}>
          {/* React Bootstrap Dropdown */}
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              <HiOutlineDotsHorizontal />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={handleTranslateClick}>
                Translate
              </Dropdown.Item>
              <Dropdown.Item as={Link} to={`/bookmarkSummary/${id}`}>
                {"Summarize"}
              </Dropdown.Item>
              <Dropdown.Item as={Link} to={`/bookmarkEdit/${id}`}>
                Edit
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <BookmarkTranslateModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onLanguageSelect={handleLanguageSelect}
        />
      </div>
      <div className={`page-container ${isDarkMode ? "dark-mode" : ""}`}>
        {loading ? (
          <CustomSpinner />
        ) : (
          <>
            <div>
              <Card className="mb-3 w-50 mx-auto">
                <Card.Body>
                  <Card.Title className="textTitle">
                    {bookmark.title}
                  </Card.Title>
                </Card.Body>
              </Card>

              <Card className="w-50 mx-auto">
                <Card.Body>
                  <Card.Text>{bookmark?.text || "No text available"}</Card.Text>
                </Card.Body>
              </Card>

              {translatedText !== null && (
                <Card className="w-50 mx-auto mt-4">
                  <Card.Body>
                    <Card.Title>Translated Text</Card.Title>
                    <Card.Text>{translatedText}</Card.Text>
                  </Card.Body>
                </Card>
              )}

              {translationDisplayed && (
                <Button
                  variant="success"
                  onClick={saveTranslatedText}
                  style={{ marginTop: "5vh" }}
                >
                  Save translated text
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default BookmarkId;
