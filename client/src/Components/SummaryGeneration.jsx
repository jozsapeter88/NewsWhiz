import React, { useState, useEffect } from "react";

const SummaryComponent = ({toggleAccordion, activeAccordion, cleanedArticle}) => {
    const [summaryResult, setSummaryResult] = useState("");

    const summarizeText = async (text, summaryPercent) => {
      try {
        const response = await fetch('http://localhost:5092/api/Summarization', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            summaryPercent: summaryPercent,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        return data.summary; // Assuming the backend response contains the summarized text
      } catch (error) {
        console.error('Error:', error);
        // Handle error, display error message, etc.
        return null;
      }
    };
    

  return (
    <>
      <div className="accordion-section">
        <button
          onClick={() => {
            toggleAccordion(0);
            summarizeText();
          }}
        >
          Summarize
        </button>
        <div
          className={`accordion-content ${
            activeAccordion === 0 ? "active" : ""
          }`}
        >
          <h3>Summary:</h3>
          <div className="summarize">
            <p>{summaryResult}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SummaryComponent;