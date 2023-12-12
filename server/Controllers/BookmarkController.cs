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
        public async Task<IActionResult> SaveBookmark([FromBody] BookmarkRequest request)
        {
            var user = await _userManager.GetUserAsync(User);

            if (request == null || string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Text) ||
                user == null)
            {
                return BadRequest("Invalid bookmark data");
            }

            try
            {
                // Decompress the received compressed text data
                var decompressedText = Decompress(request.Text);

                // Continue with the rest of your code...
                var bookmarkId = await _bookmarkService.SaveBookmarkAsync(request.Name, decompressedText, request.UserId);

                return Ok(new { BookmarkId = bookmarkId });
            }
            catch (FormatException ex)
            {
                Console.Error.WriteLine($"Error decoding Base64 data: {ex.Message}");
                return BadRequest("Invalid Base64 format");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error decompressing data: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        private string Decompress(string compressedText)
        {
            var compressedBytes = Convert.FromBase64String(compressedText);

            using (var compressedStream = new MemoryStream(compressedBytes))
            using (var decompressedStream = new MemoryStream())
            {
                using (var deflateStream = new DeflateStream(compressedStream, CompressionMode.Decompress))
                {
                    deflateStream.CopyTo(decompressedStream);
                }

                return Encoding.UTF8.GetString(decompressedStream.ToArray());
            }
        }
    }
}
