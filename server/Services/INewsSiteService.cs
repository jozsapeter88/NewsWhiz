using server.Models;

namespace server.Services;

public interface INewsSiteService
{
    List<NewsSite> GetAllNewsSites();
    NewsArticle ScrapeWebsite(string websiteUrl, string titleXPath, string articleXPath);

}