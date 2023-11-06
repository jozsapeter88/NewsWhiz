import React, { useState, useEffect } from "react";
import { Spinner, Modal, Button } from "react-bootstrap";
import "./MainPage.css";

function MainPage() {
  const [newsSites, setNewsSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [generatedKeywords, setGeneratedKeywords] = useState([]);
  const [languageDetectionResult, setLanguageDetectionResult] = useState(null);

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

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
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
  };

  const cleanedArticle = article.replace(/\s+/g, " ").trim();

  const generateKeywords = async () => {
    const url = "https://microsoft-text-analytics1.p.rapidapi.com/keyPhrases";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "21ab335ba4msh85f8c88bb6ae3f6p14ac31jsn78a47852eb0d",
        "X-RapidAPI-Host": "microsoft-text-analytics1.p.rapidapi.com",
      },
      body: JSON.stringify({
        documents: [
          {
            id: '1',
            language: 'en',
            text: cleanedArticle
          }
        ]
      })
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const detectLanguage = async () => {
    const url = 'https://microsoft-text-analytics1.p.rapidapi.com/languages';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '21ab335ba4msh85f8c88bb6ae3f6p14ac31jsn78a47852eb0d',
        'X-RapidAPI-Host': 'microsoft-text-analytics1.p.rapidapi.com'
      },
      body: JSON.stringify({
        documents: [
          {
            countryHint: 'US',
            id: '1',
            text: cleanedArticle
          },
        ],
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="main-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select a website:</label>
          <select
            className="select-site"
            value={selectedSite}
            onChange={handleSiteChange}
          >
            <option value="">Select an option</option>
            {newsSites.map((site) => (
              <option key={site.newsSiteId} value={site.name}>
                {site.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Enter the URL to scrape:</label>
          <input
            className="url-input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <Button className="scrape-button" type="submit">
          Scrape
        </Button>
      </form>
      <div>
        {loading && (
          <div className="loading-spinner-container">
            <div class="loader"></div>
          </div>
        )}

        <div className="result-container">
          <h2>Title: {title}</h2>
          <p className="article-text">Article: {cleanedArticle}</p>
        </div>
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

      <Button onClick={generateKeywords}>Generate Keywords</Button>
        <h3>Generated Keywords:</h3>
      <div className="generated-keywords">
        <ul>
          {generatedKeywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
      </div>
      
      <Button onClick={detectLanguage}>Detect Language</Button>
      <h2>Detected Language:</h2>
      {languageDetectionResult && (
        <div>
          <p>{languageDetectionResult}</p>
        </div>
      )}
    </div>
  );
}

export default MainPage;
