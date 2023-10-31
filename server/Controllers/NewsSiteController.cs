using Microsoft.AspNetCore.Mvc;
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

    [HttpGet]
    [Route("getAllNewsSites")]
    public IActionResult GetAllNewsSites()
    {
        var newsSites = _newsSiteService.GetAllNewsSites();
        return Ok(newsSites);
    }
}