namespace server.Models;

public class BookmarkEditRequest
{
    public string Name { get; set; }
    public string Title { get; set; }
    public string Text { get; set; }
    public string UserId { get; set; }
    
    public BookmarkEditRequest()
    {
        // Initialize properties
        Name = "";
        Text = "";
        Title = "";
        UserId = "";
    }
}