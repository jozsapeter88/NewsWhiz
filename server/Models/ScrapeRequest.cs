namespace server.Models;

public class ScrapeRequest
{
    public string SelectedWebsite { get; set; }
    public string TitleXPath { get; set; }
    public string ArticleXPath { get; set; }
    public string Url { get; set; }
}