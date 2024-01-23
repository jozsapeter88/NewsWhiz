using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Areas.Identity.Data.Models;
using server.Models;
using server.Models.DBContext;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookmarkController : ControllerBase
    {
        private readonly IBookmarkService _bookmarkService;
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _dbContext;

        public BookmarkController(IBookmarkService bookmarkService, UserManager<User> userManager,
            ApplicationDbContext dbContext)
        {
            _bookmarkService = bookmarkService;
            _userManager = userManager;
            _dbContext = dbContext;
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
                var bookmarkId =
                    _bookmarkService.SaveBookmarkAsync(request.Name, request.Text, request.Title, request.UserId);

                return Ok(new { BookmarkId = bookmarkId });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error saving bookmark: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditBookmark(int id, [FromBody] BookmarkEditRequest request)
        {
            var user = await _userManager.GetUserAsync(User);

            try
            {
                // Check if the bookmark with the given id exists
                var existingBookmark = await _bookmarkService.GetBookmarkByIdAsync(id);
                if (existingBookmark == null)
                {
                    return NotFound($"Bookmark with ID {id} not found.");
                }
                
                // Validate the incoming request
                if (string.IsNullOrEmpty(request.Text))
                {
                    return BadRequest("Text field is required.");
                }

                // Ensure the UserId is the same as the current user's Id
                if (request.UserId != user.Id)
                {
                    return BadRequest("Invalid UserId.");
                }

                // Update the existing bookmark's text
                existingBookmark.Text = request.Text;
                
                // Update the existing bookmark's title if it is different from the original
                if (!string.IsNullOrEmpty(request.Title) && request.Title != existingBookmark.Title)
                {
                    existingBookmark.Title = request.Title;
                }


                await _dbContext.SaveChangesAsync();

                return Ok(new { Message = "Bookmark text updated successfully." });
            }
            catch (Exception ex)
            {
                // Log the error to a more comprehensive logging system
                Console.Error.WriteLine($"Error updating bookmark: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}