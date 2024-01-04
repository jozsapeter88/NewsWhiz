import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopNavbar from "../../../Components/TopNavbar";
import { useDarkMode } from "../../../Contexts/DarkModeContext";

function BookmarkId() {
  const { id } = useParams();
  const [bookmark, setBookmark] = useState(null);
  const { isDarkMode } = useDarkMode();

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
        const response = await fetch(`http://localhost:5092/api/Bookmark/${id}`);
        if (response.ok) {
          const data = await response.json();
          setBookmark(data);
        } else {
          console.error("Error fetching bookmark:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching bookmark:", error);
      }
    };

    fetchBookmark();
  }, [id]);

  return (
    <>
    <TopNavbar />
    <div className={`page-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {bookmark && (
        <div>
          <h2>{bookmark.name}</h2>
          <p>{bookmark.text}</p>
        </div>
      )}
    </div>
    </>
  );
}

export default BookmarkId;