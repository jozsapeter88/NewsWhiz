import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopNavbar from "../../../Components/TopNavbar";
import { useDarkMode } from "../../../Contexts/DarkModeContext";
import "./BookmarkId.css";
import { Link } from "react-router-dom";
import { IoCaretBack } from "react-icons/io5";
import { Button, Badge, Card } from "react-bootstrap";
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
  const navigate = useNavigate();

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
          setEditedText(data.text || "");
          setBookmark(data);
          console.log(data);
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
          userId: loggedInUser,
        }),
      });

      if (response.ok) {
        console.log("Bookmark text updated successfully.");
        window.alert("Bookmark saved successfully!");
        navigate(`/bookmark/${id}`);
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
        <Badge
          bg="warning"
          text="dark"
          style={{ marginLeft: "auto", marginRight: "50vh" }}
        >
          Editing Mode
        </Badge>
      </div>
      <div className={`page-container ${isDarkMode ? "dark-mode" : ""}`}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div>
              {/* Title Card */}
              <Card className="mb-3 w-50 mx-auto">
                <Card.Body>
                  <Card.Title>
                    {bookmark ? <p>{bookmark.title}</p> : <p>Loading...</p>}
                  </Card.Title>
                </Card.Body>
              </Card>

              {/* Text Card */}
              <Card className="w-50 mx-auto">
                <Card.Body>
                  <div
                    className="textBody"
                    contentEditable={true}
                    onMouseUp={handleTextSelection}
                    onInput={handleTextChange}
                    dangerouslySetInnerHTML={{
                      __html: bookmark == null ? loading : bookmark.text,
                    }}
                  ></div>
                </Card.Body>
              </Card>

              <Button onClick={handleSaveButtonClick} className="mt-3">
                Save
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default BookmarkEdit;
