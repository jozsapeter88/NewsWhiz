using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SummarizationController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public SummarizationController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpPost]
        public async Task<IActionResult> SummarizeText([FromBody] SummarizeRequest request)
        {
            var apiUrl = "https://text-analysis12.p.rapidapi.com/summarize-text/api/v1.1"; // Update with the correct API endpoint

            var requestBody = new
            {
                language = "english",
                summary_percent = request.SummaryPercent,
                text = request.Text
            };

            var jsonRequest = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(jsonRequest, System.Text.Encoding.UTF8, "application/json");

            try
            {
                var apiKey = "YOUR_API_KEY"; // Replace with your RapidAPI key
                _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Key", apiKey);
                _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Host", "text-analysis12.p.rapidapi.com");

                var response = await _httpClient.PostAsync(apiUrl, content);
                response.EnsureSuccessStatusCode();

                var jsonResponse = await response.Content.ReadAsStringAsync();
                var summarizedResponse = JsonConvert.DeserializeObject<SummarizationResponse>(jsonResponse);

                return Ok(summarizedResponse);
            }
            catch (HttpRequestException ex)
            {
                Console.Error.WriteLine($"HTTP request error: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error summarizing text: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }

    public class SummarizeRequest
    {
        public string Text { get; set; }
        public int SummaryPercent { get; set; }
    }

    public class SummarizationResponse
    {
        public string Summary { get; set; }
    }
}
