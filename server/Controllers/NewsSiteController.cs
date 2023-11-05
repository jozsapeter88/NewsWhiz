using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
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

    [HttpGet("getAllNewsSites")]
    public IActionResult GetAllNewsSites()
    {
        var newsSites = _newsSiteService.GetAllNewsSites();
        return Ok(newsSites);
    }

    [HttpPost("scrape")]
    public IActionResult ScrapeWebsite([FromBody] ScrapeRequest request)
    {
        if (websiteMappings.TryGetValue(request.selectedSite, out var xPathMappings))
        {
            var scrapedData = _newsSiteService.ScrapeWebsite(request.url, xPathMappings.titleXPath, xPathMappings.articleXPath);

            if (scrapedData != null)
            {
                return Ok(scrapedData);  // Return the scraped data as JSON
            }
            else
            {
                return BadRequest("Title or article element not found on the page.");
            }
        }
        else
        {
            return BadRequest("Invalid website selection. Please choose a valid website.");
        }
    }




}