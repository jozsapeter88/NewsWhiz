using System;
using System.IO.Compression;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Areas.Identity.Data.Models;
using server.Models;
using server.Services;

namespace server.Controllers
{
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
        
        [HttpGet("GetBookmarks/{userId}")]
        public async Task<ActionResult<IEnumerable<Bookmark>>> GetBookmarksAsync(string userId)
        {
            try
            {
                var bookmarks = await _bookmarkService.GetBookmarksAsync(userId);
                return Ok(bookmarks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Bookmark>> GetBookmarkById(int id)
        {
            var bookmark = await _bookmarkService.GetBookmarkByIdAsync(id);

            if (bookmark == null)
            {
                return NotFound();
            }

            return Ok(bookmark);
        }
        
        [HttpPost]
        public IActionResult SaveBookmark([FromBody] BookmarkRequest request)
        {
            var user = _userManager.GetUserAsync(User).Result;

            try
            {
                var bookmarkId = _bookmarkService.SaveBookmarkAsync(request.Name, request.Text, request.Title, request.UserId);

                return Ok(new { BookmarkId = bookmarkId });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error saving bookmark: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
