import React, { useState, useEffect } from 'react';

function MainPage() {
  const [newsSites, setNewsSites] = useState([]);

  useEffect(() => {
    // Make an HTTP GET request to the backend API using the fetch API
    fetch('http://localhost:5092/api/news-sites/getAllNewsSites')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setNewsSites(data);
      })
      .catch(error => {
        console.error('Error fetching news sites:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>News Sites</h1>
      <ul>
        {newsSites.map(newsSite => (
          <li key={newsSite.id}>{newsSite.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default MainPage;
