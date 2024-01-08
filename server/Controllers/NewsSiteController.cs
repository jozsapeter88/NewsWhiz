using System.IO.Compression;
using System.Text;
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

 /*   [HttpPost("scrape")]
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
    }*/

    [HttpGet("getNewsSiteByName")]
    public IActionResult GetNewsSiteByName([FromQuery] string name)
    {
        var newsSite = _newsSiteService.GetNewsSiteByName(name);

        if (newsSite != null)
        {
            return Ok(newsSite);
        }
        else
        {
            return NotFound($"NewsSite with name '{name}' not found.");
        }
    }
    
    [HttpPost("scrape")]
    public IActionResult ScrapeWebsite([FromBody] ScrapeRequest request)
    {
        try
        {
            var selectedSiteData = _newsSiteService.GetNewsSiteByName(request.selectedSite);

            if (selectedSiteData != null)
            {
                // Convert the Base64-encoded string to bytes
                byte[] compressedData = Convert.FromBase64String(request.text);

                // Decompress the data using GZipStream
                using (MemoryStream compressedStream = new MemoryStream(compressedData))
                using (GZipStream decompressionStream = new GZipStream(compressedStream, CompressionMode.Decompress))
                using (StreamReader reader = new StreamReader(decompressionStream, Encoding.UTF8))
                {
                    string decompressedText = reader.ReadToEnd();

                    // Now 'decompressedText' contains the decompressed article text
                    // You can use it in your scraping logic
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
            }
            else
            {
                return BadRequest("Invalid website selection. Please choose a valid website.");
            }
        }
        catch (Exception ex)
        {
            // Handle any exceptions that might occur during decompression or scraping
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

}