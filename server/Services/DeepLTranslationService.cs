using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using server.Models;

namespace server.Services
{
    public class DeepLTranslationService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public DeepLTranslationService(HttpClient httpClient, string apiKey)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _apiKey = apiKey ?? throw new ArgumentNullException(nameof(apiKey));
        }

        public async Task<string> TranslateAsync(string text, string targetLanguage)
        {
            var apiUrl = "https://api-free.deepl.com/v2/translate";

            var requestData = new
            {
                text = text,
                target_lang = targetLanguage
            };

            var jsonRequest = JsonConvert.SerializeObject(requestData);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            try
            {
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"DeepL-Auth-Key {_apiKey}");

                using (var response = await _httpClient.PostAsync(apiUrl, content))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonResponse = await response.Content.ReadAsStringAsync();
                        var translation = JsonConvert.DeserializeObject<DeepLTranslationResponse>(jsonResponse);
                        return translation.Translations[0].Text;
                    }
                    else
                    {
                        Console.Error.WriteLine($"DeepL API request failed with status code {response.StatusCode}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error in DeepL API request: {ex.Message}");
            }
            
            return null;
        }
    }
}
