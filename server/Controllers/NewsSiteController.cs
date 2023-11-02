using System.Net;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

[Route("api/news-sites")]
[ApiController]
public class NewsSiteController : ControllerBase
{
    private readonly INewsSiteService _newsSiteService;

    public NewsSiteController(INewsSiteService newsSiteService)
    {
        _newsSiteService = newsSiteService;
    }

    private readonly Dictionary<string, (string titleXPath, string articleXPath)> websiteMappings =
        new Dictionary<string, (string, string)>
        {
            {
                "BBC",
                (
                    "//h1[@class='article-headline__text b-reith-sans-font b-font-weight-300']",
                    "//div[@class='article__body-content']"
                )
            },
            {
                "Index",
                (
                    "//div[@class='content-title']",
                    "//div[@class='cikk-torzs']"
                )
            },
        };

    [HttpGet]
    [Route("getAllNewsSites")]
    public IActionResult GetAllNewsSites()
    {
        var newsSites = _newsSiteService.GetAllNewsSites();
        return Ok(newsSites);
    }

    [HttpPost]
    [Route("scrape")]
    public IActionResult ScrapeWebsite([FromBody] ScrapeRequest request)
    {
        if (websiteMappings.TryGetValue(request.SelectedWebsite, out var xPathMappings))
        {
            if (!string.IsNullOrWhiteSpace(request.TitleXPath))
            {
                xPathMappings.titleXPath = request.TitleXPath;
            }

            if (!string.IsNullOrWhiteSpace(request.ArticleXPath))
            {
                xPathMappings.articleXPath = request.ArticleXPath;
            }

            try
            {
                var httpClient = new HttpClient();
                var html = httpClient.GetStringAsync(request.Url).Result;
                var htmlDocument = new HtmlDocument();
                htmlDocument.LoadHtml(html);

                var titleElement = htmlDocument.DocumentNode.SelectSingleNode(xPathMappings.titleXPath);
                var articleElement = htmlDocument.DocumentNode.SelectSingleNode(xPathMappings.articleXPath);

                if (titleElement != null && articleElement != null)
                {
                    var title = WebUtility.HtmlDecode(titleElement.InnerText);
                    var article = WebUtility.HtmlDecode(articleElement.InnerText);

                    var newsArticle = new NewsArticle
                    {
                        Title = title,
                        Article = article
                    };

                    return Ok(newsArticle);
                }
                else
                {
                    return BadRequest("Title or article element not found on the page.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while scraping the website: " + ex.Message);
            }
        }
        else
        {
            return BadRequest("Invalid website selection. Please choose a valid website.");
        }
    }


}