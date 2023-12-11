using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Areas.Identity.Data.Models;
using server.Models;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookmarkController : ControllerBase
{
    private readonly IBookmarkService _bookmarkService;
    private readonly UserManager<User> _userManager;

    public BookmarkController(IBookmarkService bookmarkService, UserManager<User> userManager)
    {
        _bookmarkService = bookmarkService;
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<IActionResult> SaveBookmark([FromBody] BookmarkRequest request)
    {
        var user = await _userManager.GetUserAsync(User);

        if (request == null || string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Text) ||
            user == null)
        {
            return BadRequest("Invalid bookmark data");
        }

        int bookmarkId = await _bookmarkService.SaveBookmarkAsync(request.Name, request.Text, user.Id);
        return Ok(new { BookmarkId = bookmarkId });
    }
}