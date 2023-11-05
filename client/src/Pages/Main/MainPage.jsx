import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

function MainPage() {
  const [newsSites, setNewsSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5092/api/NewsSite/getAllNewsSites")
      .then((response) => response.json())
      .then((data) => {
        setNewsSites(data);
        console.log("News sites fetched successfully:", data);
      })
      .catch((error) => console.error("Error fetching news sites:", error));
  }, []);

  const handleSiteChange = (e) => {
    const selectedWebsite = e.target.value;
    setSelectedSite(selectedWebsite);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const requestData = {
      selectedSite,
      url,
    };

    try {
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
        setTitle(data.title);
        setArticle(data.article);
      } else {
        console.log(requestData);
        console.error("Error scraping website");
        setTitle("Error");
        setArticle("Error");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTitle("Error");
      setArticle("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Select a website:
          <select value={selectedSite} onChange={handleSiteChange}>
            <option value="">Select an option</option>
            {newsSites.map((site) => (
              <option key={site.newsSiteId} value={site.name}>
                {site.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Enter the URL to scrape:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Scrape</button>
      </form>
      <div>
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <div>
            <h2>Title: {title}</h2>
            <p>Article: {article}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
