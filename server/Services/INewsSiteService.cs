using server.Models;

namespace server.Services;

public interface INewsSiteService
{
    List<NewsSite> GetAllNewsSites();
    NewsSite GetNewsSiteByName(string name);
    NewsArticle ScrapeWebsite(string websiteUrl, string titleXPath, string articleXPath);
}