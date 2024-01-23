import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopNavbar from "../../../Components/TopNavbar";
import { useDarkMode } from "../../../Contexts/DarkModeContext";
import "./BookmarkId.css";
import { Link } from "react-router-dom";
import { IoCaretBack } from "react-icons/io5";
import Button from "react-bootstrap/esm/Button";
import "./BookmarkEdit.css";
import { useAuth } from "../../../Contexts/AuthContext";

function BookmarkEdit() {
  const { user } = useAuth();
  const loggedInUser = user.id;
  const { id } = useParams();
  const [bookmark, setBookmark] = useState(null);
  const { isDarkMode } = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [editedText, setEditedText] = useState("");

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
          setEditedText(data.text || ""); // Set the initial text value
          setBookmark(data)
          console.log(data)
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

  const handleSaveButtonClick = async () => {
    try {
  
      const response = await fetch(`http://localhost:5092/api/Bookmark/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: editedText,
          userId: loggedInUser, // Include the user ID in the payload
        }),
      });
  
      if (response.ok) {
        console.log("Bookmark text updated successfully.");
        // Perform any additional actions after a successful update
      } else {
        const errorData = await response.json();
        console.error("Error updating bookmark:", errorData.errors);
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };
  

  const handleTextSelection = () => {
    const selectedText = window.getSelection().toString();
    // Handle the selected text (e.g., highlight or perform other actions)
  };

  const handleTextChange = (event) => {
    const newText = event.target.innerHTML;
    setEditedText(newText);
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
        <h1 className="editText">Editing mode</h1>
      </div>
      <div className={`page-container ${isDarkMode ? "dark-mode" : ""}`}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div>
              <h2 className="textTitle">
                {bookmark ? <p>{bookmark.title}</p> : <p>Loading...</p>}
              </h2>
              <div
                className="textBody"
                contentEditable={true}
                onMouseUp={handleTextSelection}
                onInput={handleTextChange}
                dangerouslySetInnerHTML={{
                  __html: bookmark == null ? loading : bookmark.text,
                }}
              ></div>
              <Button onClick={handleSaveButtonClick}>Save</Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default BookmarkEdit;