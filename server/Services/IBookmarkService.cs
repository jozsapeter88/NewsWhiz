using server.Areas.Identity.Data.Models;

namespace server.Services;

public interface IBookmarkService
{
    Task<int> SaveBookmarkAsync(string text);
    Task<IEnumerable<Bookmark>> GetBookmarksAsync();
}
