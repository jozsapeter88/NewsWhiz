using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookmarkController : ControllerBase
{
    private readonly IBookmarkService _bookmarkService;

    public BookmarkController(IBookmarkService bookmarkService)
    {
        _bookmarkService = bookmarkService;
    }

    [HttpPost]
    public async Task<IActionResult> SaveBookmark([FromBody] BookmarkRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Text))
        {
            return BadRequest("Invalid bookmark data");
        }

        int bookmarkId = await _bookmarkService.SaveBookmarkAsync(request.Text);
        return Ok(new { BookmarkId = bookmarkId });
    }

    [HttpGet]
    public async Task<IActionResult> GetBookmarks()
    {
        var bookmarks = await _bookmarkService.GetBookmarksAsync();
        return Ok(bookmarks);
    }
}