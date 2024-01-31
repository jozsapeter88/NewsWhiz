import React, { useState, useEffect } from "react";
import { useDarkMode } from "../../Contexts/DarkModeContext";
import { useAuth } from "../../Contexts/AuthContext";
import { Form, Card, Modal, Button, Alert } from "react-bootstrap";
import { BsBookmarkStarFill } from "react-icons/bs";
import "./MainPage.css";
import TopNavbar from "../../Components/TopNavbar";
import CustomSpinner from "../../Components/CustomSpinner";

function MainPage() {
  const [newsSites, setNewsSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [scrapeButtonDisabled, setScrapeButtonDisabled] = useState(true);
  const [showFullContent, setShowFullContent] = useState(false);
  const [bookmarkName, setBookmarkName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [detectionSuccess, setDetectionSuccess] = useState(false);

  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  useEffect(() => {
    fetch("http://localhost:5092/api/NewsSite/getAllNewsSites")
    .then((response) => response.json())
    .then((data) => {
      setNewsSites(data);
      console.log("News sites fetched successfully:", data);
    })
    .catch((error) => console.error("Error fetching news sites:", error));
  }, []);

  useEffect(() => {
    // Trigger handleScraping when selectedSite changes
    if (selectedSite && url && detectionSuccess) {
      handleScraping();
    }
  }, [selectedSite, url, detectionSuccess]);
  
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setShowAlert(false);
  };
  const extractSiteNameFromUrl = (url) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
      setUrl(url);
    }
    const urlObject = new URL(url);
    const pathSegments = urlObject.hostname.split(".");
    const wwwIndex = pathSegments.indexOf("www");

    if (wwwIndex !== -1 && wwwIndex < pathSegments.length - 1) {
      return pathSegments[wwwIndex + 1];
    } else {
      url = "www." + urlObject.hostname;
      setUrl(url);
      return "default";
    }
  };

  const handleDetectClick = async () => {
    const siteName = extractSiteNameFromUrl(url);
    let wwwAlertShown = false;

    try {
      if (siteName === "default") {
        alert("Please add 'www.' to the URL for better detection.");
        wwwAlertShown = true;
      }

      const response = await fetch(
        `http://localhost:5092/api/NewsSite/getNewsSiteByName?name=${siteName}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setSelectedSite(data);
          setScrapeButtonDisabled(false);
          setDetectionSuccess(true);
        }
      } else {
        setDetectionSuccess(false);
        if (!wwwAlertShown) {
          alert("News Site not found. Maybe it is not in our database yet.");
        }
      }
    } catch (error) {
      console.error("Error fetching NewsSite data:", error);
      setDetectionSuccess(false);
    }
  };

  const handleScraping = async () => {
    if (selectedSite && url && detectionSuccess) {
      setLoading(true);

      try {
        const requestData = {
          selectedSite: selectedSite.name,
          url: url,
          text: article,
        };

        const response = await fetch(
          "http://localhost:5092/api/NewsSite/scrape",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (!data || !data.title || !data.article) {
            console.error("Empty or invalid content");
            setTitle("");
            setArticle("");
            setShowErrorModal(true);
            return;
          }

          setTitle(data.title);
          setArticle(data.article);
        } else {
          console.error("Error scraping website");
          setTitle("");
          setArticle("");
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setTitle("Error");
        setArticle("Error");
      } finally {
        setLoading(false);
      }
    } else {
      console.error(
        "Selected NewsSite or URL is missing or detection unsuccessful."
      );
    }
  };

  const cleanedArticle = article.replace(/\s+/g, " ").trim();

  const handleBookmarkClick = async () => {
    setShowModal(true);
  };

  const handleSaveBookmark = async () => {
    const loggedInUser = user.id;

    if (!loggedInUser) {
      alert("User not logged in");
      return;
    }

    try {
      const response = await fetch("http://localhost:5092/api/Bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: bookmarkName,
          text: cleanedArticle,
          title: title,
          userId: loggedInUser,
        }),
      });

      if (response.ok) {
        alert("Bookmark saved!");
        setShowModal(false);
      } else {
        console.error("Error saving bookmark");
      }
    } catch (error) {
      console.error("Error saving bookmark:", error);
    }
  };

  return (
    <>
      <TopNavbar />
      <div className={`main-container ${isDarkMode ? "dark-mode" : ""}`}>
        {showAlert && (
          <Alert
            variant="warning"
            onClose={() => setShowAlert(false)}
            dismissible
          >
            During development, the application only supports some news sites.{" "}
            <Alert.Link
              onClick={() =>
                setUrl(
                  "https://www.bbc.com/culture/article/20240129-dr-strangelove-at-60-the-mystery-behind-kubricks-cold-war-masterpiece"
                )
              }
            >
              Click here to generate a usable link.
            </Alert.Link>
          </Alert>
        )}

        <div
          className={`flex-container ${
            title && cleanedArticle ? "collapsed" : ""
          }`}
        >
          <div className="control">
            <Form.Control
              className="url-input"
              type="text"
              placeholder="Paste URL"
              value={url}
              onChange={handleUrlChange}
              style={{ fontSize: "1.2rem", padding: "0.5rem" }}
            />
            <div className="button-container">
              <Button
                style={{ fontSize: "1.2rem", padding: "0.5rem", width: "15vh"}}
                onClick={handleDetectClick}
              >
                Get Article
              </Button>
            </div>
            {cleanedArticle && (
              <Button
                variant="warning"
                className="bookmarkBtn"
                onClick={handleBookmarkClick}
              >
                <BsBookmarkStarFill />
              </Button>
            )}
          </div>
        </div>

        <div>
          {loading && <CustomSpinner />}
          {title && cleanedArticle && (
            <Card className="result-container">
              <h2>{title}</h2>
              <p className="article-text">
                {showFullContent
                  ? cleanedArticle
                  : `${cleanedArticle.slice(0, 1200)}...`}
              </p>
              {cleanedArticle.length > 1200 && (
                <button onClick={() => setShowFullContent(!showFullContent)}>
                  {showFullContent ? "View less" : "View more..."}
                </button>
              )}
            </Card>
          )}
        </div>
        <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
          <Modal.Header closeButton>
            <Modal.Title>An error occurred</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Check your URL format ("https://www.example.com") or choose the
            correct webpage.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseErrorModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for entering bookmark name */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Enter Bookmark Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={bookmarkName}
              onChange={(e) => setBookmarkName(e.target.value)}
              placeholder="Enter bookmark name"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveBookmark}>
              Save Bookmark
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default MainPage;