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

    [HttpGet("getAllNewsSites")]
    public IActionResult GetAllNewsSites()
    {
        var newsSites = _newsSiteService.GetAllNewsSites();
        return Ok(newsSites);
    }

    [HttpPost("scrape")]
    public IActionResult ScrapeWebsite([FromBody] ScrapeRequest request)
    {
        var selectedSiteData = _newsSiteService.GetNewsSiteByName(request.selectedSite);

        if (selectedSiteData != null)
        {
            var scrapedData = _newsSiteService.ScrapeWebsite(
                request.url, 
                selectedSiteData.TitleXPath, 
                selectedSiteData.ArticleXPath
            );

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