using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using server.Models.Summarization;

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
        public async Task<IActionResult> SummarizeText([FromBody] SummarizationRequest request)
        {
            var apiUrl = "https://text-analysis12.p.rapidapi.com/summarize-text/api/v1.1";

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
                var apiKey = "21ab335ba4msh85f8c88bb6ae3f6p14ac31jsn78a47852eb0d"; // Replace with your RapidAPI key
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
}