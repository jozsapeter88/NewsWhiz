using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using server.Models.Translation;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TranslationController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public TranslationController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpPost]
        public async Task<IActionResult> TranslateText([FromBody] TranslationRequest request)
        {
            var apiUrl = "http://localhost:5000/translate"; // Update with the correct API endpoint

            var requestBody = new
            {
                q = request.Text,
                source = request.SourceLanguage,
                target = request.TargetLanguage,
            };

            var jsonRequest = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(jsonRequest, System.Text.Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(apiUrl, content);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();

            // Deserialize the string response from the API to JSON
            var translationResponse = JsonConvert.DeserializeObject<TranslationResponse>(jsonResponse);

            // Return the JSON response to the frontend
            return Ok(translationResponse);
        }
    }
}