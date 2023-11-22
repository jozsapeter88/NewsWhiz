import React, { useState, useEffect } from "react";
import "./KeywordComponent.css";

const KeywordComponent = ({toggleAccordion, activeAccordion, summaryResult}) => {

    const [generatedKeywords, setGeneratedKeywords] = useState([]);

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

  return (
    <>
      {/* Generate Keywords Accordion */}
      <div className="accordion-section">
        <button
          onClick={() => {
            toggleAccordion(1);
            generateKeywords();
          }}
        >
          Generate Keywords
        </button>
        <div
          className={`accordion-content ${
            activeAccordion === 1 ? "active" : ""
          }`}
        >
          <h3>Generated Keywords:</h3>
          <div className="generated-keywords">
            <p>{generatedKeywords}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default KeywordComponent;
