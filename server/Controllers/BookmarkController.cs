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

        [HttpPost]
        public IActionResult SaveBookmark([FromBody] BookmarkRequest request)
        {
            var user = _userManager.GetUserAsync(User).Result;

            try
            {
                var bookmarkId = _bookmarkService.SaveBookmarkAsync(request.Name, request.Text, user.Id);

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
