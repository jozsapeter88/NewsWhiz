using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

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
            var apiUrl = "http://192.168.0.159:5000/translate"; // Update with the correct API endpoint

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
            var translationResponse = JsonConvert.DeserializeObject<TranslationResponse>(jsonResponse);

            return Ok(translationResponse.TranslatedText);
        }
    }

    public class TranslationRequest
    {
        public string Text { get; set; }
        public string SourceLanguage { get; set; }
        public string TargetLanguage { get; set; }
    }

    public class TranslationResponse
    {
        public string TranslatedText { get; set; }
    }
}