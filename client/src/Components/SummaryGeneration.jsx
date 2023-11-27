import React, { useState, useEffect } from "react";

const SummaryComponent = ({toggleAccordion, activeAccordion, cleanedArticle}) => {
    const [summaryResult, setSummaryResult] = useState("");

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