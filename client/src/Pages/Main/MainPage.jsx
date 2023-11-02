import React, { useState } from 'react';

function MainPage() {
  const [selectedWebsite, setSelectedWebsite] = useState('');
  const [titleXPath, setTitleXPath] = useState(''); // Custom XPath for title
  const [articleXPath, setArticleXPath] = useState(''); // Custom XPath for article
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [article, setArticle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      selectedWebsite,
      titleXPath,
      articleXPath,
      url,
    };

    // Send a POST request with requestData to the backend

    // On the server side, use HtmlAgilityPack and requestData to scrape data

    // Set the title and article state based on the scraped data
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Select a website:
          <select value={selectedWebsite} onChange={(e) => setSelectedWebsite(e.target.value)}>
            <option value="BBC">BBC</option>
            <option value="Index">Index</option>
            {/* Add options for other available websites */}
          </select>
        </label>
        <br />
        <label>
          Custom XPath for Title:
          <input
            type="text"
            value={titleXPath}
            onChange={(e) => setTitleXPath(e.target.value)}
            placeholder="//h1[@class='custom-title']" // Placeholder for guidance
          />
        </label>
        <br />
        <label>
          Custom XPath for Article:
          <input
            type="text"
            value={articleXPath}
            onChange={(e) => setArticleXPath(e.target.value)}
            placeholder="//div[@class='custom-article']" // Placeholder for guidance
          />
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

export default MainPage;