using server.Areas.Identity.Data.Models;
using server.Models;

namespace server.Services;

public interface IBookmarkService
{
    Task<int> SaveBookmarkAsync(string name, string text, string title, string userId);
    Task<IEnumerable<Bookmark>> GetBookmarksAsync(string userId);
    Task<Bookmark> GetBookmarkByIdAsync(int id);
    Task<bool> EditBookmarkAsync(int id, BookmarkEditRequest request, string userId);
    Task<bool> UpdateTranslatedTextAsync(int id, string translatedText);
    Task<bool> UpdateSummarizerTextAsync(int id, string text);
    Task<bool> DeleteBookmarkAsync(int id);
}