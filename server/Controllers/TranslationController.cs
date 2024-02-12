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
            var apiUrl = "https://api-free.deepl.com/v2/translate";

            var requestBody = new
            {
                text = request.Text,
                target_lang = request.TargetLanguage
            };

            _httpClient.DefaultRequestHeaders.Add("Authorization",
                "DeepL-Auth-Key ce5d753d-20fd-6b84-b63d-14e10d5a5cb4:fx");

            var jsonRequest = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(jsonRequest, System.Text.Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(apiUrl, content);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var translationResponse = JsonConvert.DeserializeObject<TranslationResponse>(jsonResponse);

            return Ok(translationResponse.Translations[0].Text);
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
        public DeepLTranslation[] Translations { get; set; }
    }

    public class DeepLTranslation
    {
        public string Text { get; set; }
    }
}