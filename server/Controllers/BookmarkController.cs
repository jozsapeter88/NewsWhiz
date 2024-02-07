using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using server.Areas.Identity.Data.Models;
using server.Models;
using server.Models.DBContext;
using server.Services;
using Microsoft.Extensions.Configuration;

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
        private readonly string _deepLApiKey;

        public BookmarkController(IBookmarkService bookmarkService, UserManager<User> userManager,
            ApplicationDbContext dbContext, DeepLTranslationService translationService, IConfiguration configuration)
        {
            _bookmarkService = bookmarkService;
            _userManager = userManager;
            _dbContext = dbContext;
            _translationService = translationService;
            _configuration = configuration;
            _deepLApiKey = _configuration["DeepL:ApiKey"];
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
        public async Task<IActionResult> TranslateBookmark([FromBody] BookmarkRequest request, string targetLanguage)
        {
            try
            {
                // Construct the translation request object
                var translationRequest = new
                {
                    text = request.Text,
                    targetLanguage = targetLanguage
                };

                // Serialize the request object to JSON
                var jsonRequest = JsonConvert.SerializeObject(translationRequest);

                // Create a new HttpClient instance
                using (var httpClient = new HttpClient())
                {
                    // Set the required headers
                    httpClient.DefaultRequestHeaders.Add("Content-Type", "application/json");
                    httpClient.DefaultRequestHeaders.Add("Authorization", $"DeepL-Auth-Key {_deepLApiKey}");

                    // Send the POST request to the DeepL translation API
                    var response = await httpClient.PostAsync("https://api.deepl.com/v2/translate",
                        new StringContent(jsonRequest, Encoding.UTF8, "application/json"));

                    // Check if the request was successful
                    if (response.IsSuccessStatusCode)
                    {
                        // Read the response content
                        var jsonResponse = await response.Content.ReadAsStringAsync();

                        // Deserialize the response JSON
                        var translationResponse = JsonConvert.DeserializeObject<JObject>(jsonResponse);

                        // Extract the translated text from the response
                        var translatedText = translationResponse["translations"]?[0]?["text"]?.ToString();

                        // Return the translated text to the client
                        return Ok(new { TranslatedText = translatedText });
                    }
                    else
                    {
                        // Return a BadRequest response with the reason phrase
                        return BadRequest($"Translation failed: {response.ReasonPhrase}");
                    }
                }
            }
            catch (Exception ex)
            {
                // Log any exceptions that occur during translation
                Console.Error.WriteLine($"Error translating bookmark: {ex.Message}");

                // Return a StatusCode 500 response for internal server errors
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}