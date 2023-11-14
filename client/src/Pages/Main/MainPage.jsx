import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "./MainPage.css";
import SentimentBar from "../../Components/SentimentBar";

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
  const [summaryResult, setSummaryResult] = useState("");
  const [sentimentAnalysisResult, setSentimentAnalysisResult] = useState("");
  const [aggregateSentiment, setAggregateSentiment] = useState(null);
  const [scrapeButtonDisabled, setScrapeButtonDisabled] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5092/api/NewsSite/getAllNewsSites")
      .then((response) => response.json())
      .then((data) => {
        setNewsSites(data);
        console.log("News sites fetched successfully:", data);
      })
      .catch((error) => console.error("Error fetching news sites:", error));
  }, []);

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const extractSiteNameFromUrl = (url) => {
    // Check if the URL starts with 'http://' or 'https://'
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // If not, prepend 'https://' to the URL
      url = 'https://' + url;
    }
  
    // Example extraction logic: Assuming the site name is the next segment after "www"
    const urlObject = new URL(url);
    const pathSegments = urlObject.hostname.split(".");
    const wwwIndex = pathSegments.indexOf("www");
  
    if (wwwIndex !== -1 && wwwIndex < pathSegments.length - 1) {
      return pathSegments[wwwIndex + 1];
    } else {
      // Return a default or handle the case where "www" or the next segment is not found
      return "default";
    }
  };
  
  const handleScrapeClick = async () => {
    if (selectedSite && url) {
      setLoading(true);
      const requestData = {
        selectedSite: selectedSite.name,
        url: url,
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
          await summarizeText();
          setSummaryResult(summaryResult);
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
    } else {
      console.error("Selected NewsSite or URL is missing.");
    }
  };

  const handleDetectClick = async () => {
    const siteName = extractSiteNameFromUrl(url);

    try {
      const response = await fetch(
        `http://localhost:5092/api/NewsSite/getNewsSiteByName?name=${siteName}`
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedSite(data);
        setScrapeButtonDisabled(false);
      } else {
        console.error("Error fetching NewsSite data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching NewsSite data:", error);
    }
  };

  const cleanedArticle = article.replace(/\s+/g, " ").trim();

  const summarizeText = async () => {
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
        summary_percent: 10,
        text: cleanedArticle,
      }),
    };
    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (result.ok) {
        setSummaryResult(result.summary);
      } else {
        console.error("Error in summarization:", result.msg);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
            id: "1",
            language: "en",
            text: summaryResult,
          },
        ],
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (result.documents && result.documents.length > 0) {
        const keyPhrases = result.documents[0].keyPhrases;

        if (keyPhrases && keyPhrases.length > 0) {
          const formattedKeywords = keyPhrases
            .map((keyword) => `"${keyword}"`)
            .join(" ");
          setGeneratedKeywords(formattedKeywords);
        } else {
          console.error("No key phrases found in the response");
        }
      } else {
        console.error("Invalid response format");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const detectLanguage = async () => {
    const url = "https://microsoft-text-analytics1.p.rapidapi.com/languages";
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
            countryHint: "US",
            id: "1",
            text: summaryResult,
          },
        ],
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (result.documents && result.documents.length > 0) {
        const detectedLanguage = result.documents[0].detectedLanguage;

        if (detectedLanguage) {
          const languageName = detectedLanguage.name;
          console.log(languageName);
          setLanguageDetectionResult(languageName);
        } else {
          console.error("No detected language found in the response");
        }
      } else {
        console.error("Invalid response format");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const analyzeSentiment = async () => {
    const url =
      "https://text-analysis12.p.rapidapi.com/sentiment-analysis/api/v1.1";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "21ab335ba4msh85f8c88bb6ae3f6p14ac31jsn78a47852eb0d",
        "X-RapidAPI-Host": "text-analysis12.p.rapidapi.com",
      },
      body: JSON.stringify({
        language: "english",
        text: summaryResult,
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (result.sentiment) {
        console.log(result.sentiment);
        console.log(result);
        setSentimentAnalysisResult(result.sentiment);
        setAggregateSentiment(result.aggregate_sentiment);
      } else {
        console.error("Sentiment field not found in the response");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="main-container">
      <div>
        <label>Paste URL:</label>
        <input
          className="url-input"
          type="text"
          value={url}
          onChange={handleUrlChange}
        />
        <Button onClick={handleDetectClick}>Detect</Button>
        {selectedSite && (
          <div>
            <h3>Detected News Site:</h3>
            <p>{selectedSite.name}</p>
          </div>
        )}
        <Button onClick={handleScrapeClick} disabled={scrapeButtonDisabled}>
          {" "}
          Scrape!
        </Button>
      </div>
      <div>
        {loading && (
          <div className="loading-spinner-container">
            <div className="loader"></div>
          </div>
        )}

        <div className="result-container">
          <h2>{title}</h2>
          <p className="article-text">{cleanedArticle}</p>
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

      <Button onClick={summarizeText}>Summarize</Button>
      <h3>Summary:</h3>
      <div className="summarize">
        <p>{summaryResult}</p>
      </div>

      <Button onClick={generateKeywords}>Generate Keywords</Button>
      <h3>Generated Keywords:</h3>
      <div className="generated-keywords">
        <p>{generatedKeywords}</p>
      </div>

      <Button onClick={detectLanguage}>Detect Language</Button>
      <h2>Detected Language:</h2>
      {languageDetectionResult && (
        <div>
          <p>{languageDetectionResult}</p>
        </div>
      )}

      <Button onClick={analyzeSentiment}>Analyse Sentiment</Button>
      <h2>Detected Sentiment:</h2>
      {sentimentAnalysisResult && (
        <div>
          <SentimentBar
            sentimentAnalysisResult={sentimentAnalysisResult}
            aggregateSentiment={aggregateSentiment}
          />
        </div>
      )}
    </div>
  );
}

export default MainPage;
