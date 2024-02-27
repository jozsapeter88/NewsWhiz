namespace server.Models.Summarization;

public class SummarizationRequest
{
    public string Text { get; set; }
    public int SummaryPercent { get; set; }
}