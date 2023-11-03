using System.Net;
using HtmlAgilityPack;
using server.Models;
using server.Models.DBContext;
namespace server.Services;

public class NewsSiteService : INewsSiteService
{
    private readonly ApplicationDbContext _context;

    public NewsSiteService(ApplicationDbContext context)
    {
        _context = context;
    }

    public List<NewsSite> GetAllNewsSites()
    {
        return _context.NewsSites.ToList();
    }
    
    public NewsArticle ScrapeWebsite(string websiteUrl, string titleXPath, string articleXPath)
    {
        try
        {
            var httpClient = new HttpClient();
            var html = httpClient.GetStringAsync(websiteUrl).Result;
            var htmlDocument = new HtmlDocument();
            htmlDocument.LoadHtml(html);

            var titleElement = htmlDocument.DocumentNode.SelectSingleNode(titleXPath);
            var articleElement = htmlDocument.DocumentNode.SelectSingleNode(articleXPath);

            if (titleElement != null && articleElement != null)
            {
                var title = WebUtility.HtmlDecode(titleElement.InnerText);
                var article = WebUtility.HtmlDecode(articleElement.InnerText);

                return new NewsArticle
                {
                    Title = title,
                    Article = article
                };
            }
            else
            {
                // Handle the case where the title or article element is not found.
                return null;
            }
        }
        catch (Exception ex)
        {
            // Handle any exceptions that may occur during scraping.
            throw new ApplicationException("Error scraping website", ex);
        }
    }
}