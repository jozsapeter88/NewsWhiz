using server.Areas.Identity.Data.Models;

namespace server.Models;

public class Bookmark
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Text { get; set; }

    // Foreign key to link Bookmark with User
    public string UserId { get; set; }
    public User User { get; set; }
}
