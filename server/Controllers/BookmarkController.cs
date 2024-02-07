﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        private readonly DeepLTranslationService _translationService;
        private readonly IConfiguration _configuration;

        public BookmarkController(IBookmarkService bookmarkService, UserManager<User> userManager,
            ApplicationDbContext dbContext, DeepLTranslationService translationService, IConfiguration configuration)
        {
            _bookmarkService = bookmarkService;
            _userManager = userManager;
            _dbContext = dbContext;
            _translationService = translationService;
            _configuration = configuration;
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
            try
            {
                var existingBookmark = await _dbContext.Bookmarks.FirstOrDefaultAsync(b => b.Id == id);

                if (existingBookmark == null)
                {
                    return NotFound();
                }


                existingBookmark.Text = request.Text;

                await _dbContext.SaveChangesAsync();

                return Ok(new { Message = "Bookmark text updated successfully" });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error updating bookmark: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("TranslateBookmark")]
        public async Task<IActionResult> TranslateBookmark([FromBody] BookmarkRequest request, string target_lang)
        {
            try
            {
                var translatedText = await _translationService.TranslateAsync(request.Text, target_lang);
                return Ok(new { TranslatedText = translatedText });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error translating bookmark: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}