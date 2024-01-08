namespace server.Models;

public class ScrapeRequest
{
    public string selectedSite { get; set; }
    public string url { get; set; }
    public string text { get; set; }
}