using server.Areas.Identity.Data.Models;
using server.Models;

namespace server.Services;

public interface IBookmarkService
{
    Task<int> SaveBookmarkAsync(string name, string text);
    Task<IEnumerable<Bookmark>> GetBookmarksAsync();
}
