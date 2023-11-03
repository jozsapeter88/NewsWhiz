import React, { useState } from 'react';

function WebScraper() {
  const [selectedWebsite, setSelectedWebsite] = useState('');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [article, setArticle] = useState('');

  const handleWebsiteChange = (selectedWebsite) => {
    setSelectedWebsite(selectedWebsite);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      selectedWebsite,
      url,
    };

    try {
      const response = await fetch("http://localhost:5092/api/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("yeah boy");
      } else {
        console.log("nem yeah boy");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    // try {
    //   const response = await fetch('http://localhost:5092/api/newssite/scrape', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(requestData),
    //   });
      
    //   if (response.ok) {
    //     const data = await response.json();
    //     setTitle(data.title);
    //     setArticle(data.article);
    //   } else {
    //     console.log(requestData);
    //     console.error('Error scraping website');
    //     setTitle('Error');
    //     setArticle('Error');
    //   }
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    //   setTitle('Error');
    //   setArticle('Error');
    // }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Select a website:
          <select value={selectedWebsite} onChange={(e) => handleWebsiteChange(e.target.value)}>
            <option value="BBC">BBC</option>
            <option value="Index">Index</option>
            {/* Add options for other available websites */}
          </select>
        </label>
        <br />
        <label>
          Enter the URL to scrape:
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
        </label>
        <br />
        <button type="submit">Scrape</button>
      </form>
      <div>
        <h2>Title: {title}</h2>
        <p>Article: {article}</p>
      </div>
    </div>
  );
}

export default WebScraper;
