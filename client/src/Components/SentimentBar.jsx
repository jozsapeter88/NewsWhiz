import React from "react";

const SentimentBar = ({ sentimentAnalysisResult, aggregateSentiment }) => {
  const { pos, neg, neu } = aggregateSentiment;

  const positiveWidth = (pos * 100).toFixed(2) + "%";
  const negativeWidth = (neg * 100).toFixed(2) + "%";
  const neutralWidth = (neu * 100).toFixed(2) + "%";
  return (
    <div className="progressbar">
      <h2>{sentimentAnalysisResult}</h2>
      <div className="progress rounded-pill">
        <div
          role="progressbar"
          aria-valuenow="30"
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: positiveWidth }}
          className="progress-bar bg-success"
        >
          {" "}
          Positive
        </div>
        <div
          role="progressbar"
          aria-valuenow="22"
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: neutralWidth }}
          className="progress-bar bg-warning"
        >
          Neutral
        </div>
        <div
          role="progressbar"
          aria-valuenow="15"
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: negativeWidth }}
          className="progress-bar bg-danger"
        >
          Negative
        </div>
      </div>
    </div>
  );
};

export default SentimentBar;
