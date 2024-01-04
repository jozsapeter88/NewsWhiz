import React, { useState, useEffect } from "react";
import { useAuth } from "../../../Contexts/AuthContext";
import { Card } from "react-bootstrap";

function BookmarkPage() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(`http://localhost:5092/api/Bookmark/GetBookmarks/${user.id}`);
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

  return (
    <div>
      <h2>Your Bookmarks</h2>
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id}>
          <Card.Body>
            <Card.Title>{bookmark.name}</Card.Title>
            <Card.Text>{bookmark.text}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default BookmarkPage;
