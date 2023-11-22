import React, { useState, useEffect } from "react";
import { Accordion, Card, Modal, Button } from "react-bootstrap";
import "./MainPage.css";
import SentimentBar from "../../Components/SentimentBar";
import TopNavbar from "../../Components/TopNavbar";
import KeywordComponent from "../../Components/KeywordComponent";
import SummaryComponent from "../../Components/SummaryGeneration";

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
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

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
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
      setUrl(url);
    }
    const urlObject = new URL(url);
    const pathSegments = urlObject.hostname.split(".");
    const wwwIndex = pathSegments.indexOf("www");

    if (wwwIndex !== -1 && wwwIndex < pathSegments.length - 1) {
      return pathSegments[wwwIndex + 1];
    } else {
      url = "www." + urlObject.hostname;
      setUrl(url);
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

          // Check if the content is empty or not suitable for summarization
          if (!data || !data.title || !data.article) {
            console.error("Empty or invalid content");
            setTitle("");
            setArticle("");
            setShowErrorModal(true);
            return;
          }

          setTitle(data.title);
          setArticle(data.article);
          await summarizeText();

          // Detect language
          await detectLanguage();

          // Analyze sentiment
          await analyzeSentiment();
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
    let wwwAlertShown = false;

    try {
      if (siteName === "default") {
        alert("Please add 'www.' to the URL for better detection.");
        wwwAlertShown = true;
      }

      const response = await fetch(
        `http://localhost:5092/api/NewsSite/getNewsSiteByName?name=${siteName}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setSelectedSite(data);
          setScrapeButtonDisabled(false);
        }
      } else {
        if (!wwwAlertShown) {
          alert("News Site not found. Maybe it is not in our database yet.");
        }
      }
    } catch (error) {
      console.error("Error fetching NewsSite data:", error);
    }
  };

  const cleanedArticle = article.replace(/\s+/g, " ").trim();

  const summarizeText = async () => {
    console.log("Cleaned Article:", cleanedArticle);

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

      console.log("Summarization Request:", options);
      console.log("Summarization Result:", result);

      if (result.ok) {
        setSummaryResult(result.summary);
      } else {
        console.error("Error in summarization:", result.msg);
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

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <>
      <TopNavbar />
    <div className={`main-container ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="control">
        <input
          className="url-input"
          type="text"
          placeholder="Paste URL"
          value={url}
          onChange={handleUrlChange}
        />
        <div className="button-container">
          <Button onClick={handleDetectClick}>Detect</Button>
          <Button
            onClick={handleScrapeClick}
            disabled={scrapeButtonDisabled}
            className="button-scrape"
          >
            Scrape!
          </Button>
        </div>
      </div>
      <div className="cards-container">
        <Card className="detected-site">
          {selectedSite && (
            <div>
              <h3>{selectedSite.name}</h3>
            </div>
          )}
        </Card>

        <Card className="detected-lang">
          {languageDetectionResult && (
            <div>
              <h3>{languageDetectionResult}</h3>
            </div>
          )}
        </Card>
      </div>
      <div>
        {loading && (
          <div className="loading-spinner-container">
            <div className="loader"></div>
          </div>
        )}
        {title && cleanedArticle && (
          <Card className="result-container">
            <h2>{title}</h2>
            <p className="article-text">
              {showFullContent
                ? cleanedArticle
                : `${cleanedArticle.slice(0, 1200)}...`}
            </p>
            {cleanedArticle.length > 1200 && (
              <button onClick={() => setShowFullContent(!showFullContent)}>
                {showFullContent ? "View less" : "View more..."}
              </button>
            )}
          </Card>
        )}
        <div className="sentiment-result">
          {sentimentAnalysisResult && (
            <>
              <p>
                Sentiment analysis result: mostly{" "}
                <b>{sentimentAnalysisResult}</b>
              </p>
              <div>
                <SentimentBar
                  sentimentAnalysisResult={sentimentAnalysisResult}
                  aggregateSentiment={aggregateSentiment}
                />
              </div>
            </>
          )}
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

      <SummaryComponent toggleAccordion={toggleAccordion} activeAccordion={activeAccordion} cleanedArticle={cleanedArticle} />
      <KeywordComponent toggleAccordion={toggleAccordion} summaryResult={summaryResult} activeAccordion={activeAccordion} />
    </div>
    </>
  );
}

export default MainPage;
