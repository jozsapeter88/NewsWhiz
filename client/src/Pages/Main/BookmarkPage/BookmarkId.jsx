import React, { useState, useEffect } from "react";
import { Dropdown, Form, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import TopNavbar from "../../../Components/TopNavbar";
import { useDarkMode } from "../../../Contexts/DarkModeContext";
import "./BookmarkId.css";
import { Link } from "react-router-dom";
import { IoCaretBack } from "react-icons/io5";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Button from "react-bootstrap/esm/Button";
import { useAuth } from "../../../Contexts/AuthContext";

function BookmarkId() {
  const { user } = useAuth();
  const { id } = useParams();
  const loggedInUser = user.id;
  const [bookmark, setBookmark] = useState(null);
  const { isDarkMode } = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [translatedText, setTranslatedText] = useState(null);
  const [summaryResult, setSummaryResult] = useState(null);
  const [summaryPercent, setSummaryPercent] = useState(100);
  const [selectedPercentage, setSelectedPercentage] = useState(100);

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

  const handleDropdownSelection = async () => {
    if (!summaryResult) {
      await handleSummarization();
    } else {
      setSummaryResult(null);
    }
  };

  const saveSummarizedText = async () => {
    try {
      const response = await fetch(`http://localhost:5092/api/Bookmark/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: summaryResult,
          userId: loggedInUser, // Assuming you have user authentication
        }),
      });

      if (response.ok) {
        console.log("Summarized text saved successfully.");
        window.alert("Summarized text saved successfully!");
        // Optionally, you can navigate to another page or update the UI as needed.
      } else {
        const errorData = await response.json();
        console.error("Error saving summarized text:", errorData.errors);
      }
    } catch (error) {
      console.error("Error saving summarized text:", error);
    }
  };

  const handleTranslate = async () => {
    try {
      const response = await fetch(
        "http://localhost:5092/api/Bookmark/TranslateBookmark",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: bookmark.name, // Adjust the property names accordingly
            text: bookmark.text,
            title: bookmark.title,
            userId: loggedInUser,
            targetLanguage: "hu",
          }),
        }
      );
      console.log("API Response:", response.status, response.statusText);
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      if (response.ok) {
        const data = await response.json();
        console.log("Translation and Save successful:", data.BookmarkId);
        // Optionally, you can update the UI or take any other action based on the response.
      } else {
        console.error("Error in Translation and Save:", response.statusText);
      }
    } catch (error) {
      console.error("Error translating and saving bookmark:", error.message);
    }
  };

  const handleSummarization = async () => {
    const url =
      "https://text-analysis12.p.rapidapi.com/summarize-text/api/v1.1";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "21ab335ba4msh85f8c88bb6ae3f6p14ac31jsn78a47852eb0d",
        "X-RapidAPI-Host": "text-analysis12.p.rapidapi.com",
      },
      body: JSON.stringify({
        language: "english",
        summary_percent: summaryPercent,
        text: bookmark.text,
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (response.ok) {
        await setSummaryResult(result.summary);
      } else {
        console.error("Error in summarization:", result.msg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value, 10);
    const roundedValue = Math.round(value / 10) * 10;
    setSelectedPercentage(roundedValue);
  };

  const handleOkButtonClick = () => {
    setSummaryPercent(selectedPercentage);
    handleSummarization();
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
              <Dropdown.Item onClick={handleTranslate}>Translate</Dropdown.Item>
              <Dropdown.Item onClick={handleDropdownSelection}>
                {summaryResult ? "Show original text" : "Summarize"}
              </Dropdown.Item>
              <Dropdown.Item as={Link} to={`/bookmarkEdit/${id}`}>
                Edit
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className={`page-container ${isDarkMode ? "dark-mode" : ""}`}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Slider for summary percentage */}
            {summaryResult && (
              <Form className="summary-slider, mb-3 w-50 mx-auto">
                <Form.Label>
                  Summary Percentage: {selectedPercentage}%
                </Form.Label>
                <Form.Range
                  value={selectedPercentage}
                  onChange={handleSliderChange}
                  min={10}
                  max={100}
                />
                <Button variant="primary" onClick={handleOkButtonClick}>
                  Ok
                </Button>
              </Form>
            )}
            <div>
              <Card className="mb-3 w-50 mx-auto">
                <Card.Body>
                  <Card.Title className="textTitle">
                    {bookmark ? <p>{bookmark.title}</p> : <p>Loading...</p>}
                  </Card.Title>
                </Card.Body>
              </Card>
              <Card className="w-50 mx-auto">
                <Card.Body>
                  {summaryResult !== null ? (
                    <Card.Text>{summaryResult}</Card.Text>
                  ) : (
                    <Card.Text>
                      {bookmark?.text || "No text available"}
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
              <Button
                variant="success"
                onClick={saveSummarizedText}
                style={{ marginTop: "5vh" }}
              >
                Save
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default BookmarkId;
