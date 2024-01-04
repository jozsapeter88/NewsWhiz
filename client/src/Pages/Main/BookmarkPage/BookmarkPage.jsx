import React, { useState, useEffect } from "react";
import { useAuth } from "../../../Contexts/AuthContext";
import { Card, Button } from "react-bootstrap";
import TopNavbar from "../../../Components/TopNavbar";
import { Link } from "react-router-dom";
import "./BookmarkPage.css";
import { useDarkMode } from "../../../Contexts/DarkModeContext";

function BookmarkPage() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(
          `http://localhost:5092/api/Bookmark/GetBookmarks/${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setBookmarks(data);
        } else {
          console.error("Error fetching bookmarks:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    if (user.id) {
      fetchBookmarks();
    }
  }, [user.id]);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <TopNavbar />
      <h2>Your Bookmarks</h2>
      <div className="bookmark-container">
        {bookmarks.map((bookmark) => (
          <Card key={bookmark.id} className="bookmark-card">
            <Card.Body>
              <Card.Title className="bookmark-title">
                {bookmark.name}
              </Card.Title>
              <Card.Text>{bookmark.title}</Card.Text>
              <Card.Text className="bookmark-text">
                {truncateText(bookmark.text, 50)}
              </Card.Text>
              <Link to={`/bookmark/${bookmark.id}`} className="link-button">
                <Button variant="primary">Read</Button>
              </Link>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
}

export default BookmarkPage;
