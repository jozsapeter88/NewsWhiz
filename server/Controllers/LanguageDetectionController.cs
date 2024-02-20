using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using server.Models.LanguageDetection;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LanguageDetectionController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public LanguageDetectionController(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    [HttpPost]
    public async Task<IActionResult> DetectLanguage([FromBody] LanguageDetectionRequest request)
    {
        try
        {
            var apiUrl = "http://localhost:5000/detect"; // Update with the correct API endpoint

            var requestBody = new
            {
                q = request.Text,
            };

            var jsonRequest = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(jsonRequest, System.Text.Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(apiUrl, content);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var detectionResults = JsonConvert.DeserializeObject<List<LanguageDetectionResult>>(jsonResponse);

            return Ok(detectionResults);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal Server Error: {ex.Message}");
        }
    }
}