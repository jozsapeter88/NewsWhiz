using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Models.DBContext;

namespace server.Services;

public class BookmarkService : IBookmarkService
{
    private readonly ApplicationDbContext _dbContext;

    public BookmarkService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<int> SaveBookmarkAsync(string name, string text, string title, string userId)
    {
        var bookmark = new Bookmark { Name = name, Text = text, Title = title, UserId = userId };
        _dbContext.Bookmarks.Add(bookmark);
        await _dbContext.SaveChangesAsync();
        return bookmark.Id;
    }


    public async Task<bool> EditBookmarkAsync(int id, BookmarkEditRequest request, string userId)
    {
        try
        {
            var existingBookmark = await _dbContext.Bookmarks.FirstOrDefaultAsync(b => b.Id == id);

            if (existingBookmark == null)
            {
                return false;
            }

            if (!string.IsNullOrEmpty(request.UserId) && request.UserId != userId)
            {
                return false;
            }

            if (!string.IsNullOrEmpty(request.Text) && existingBookmark.Text != request.Text)
            {
                existingBookmark.Text = request.Text;
                await _dbContext.SaveChangesAsync();
            }

            return true;
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error updating bookmark: {ex.Message}");
            return false;
        }
    }

    public async Task<IEnumerable<Bookmark>> GetBookmarksAsync(string userId)
    {
        return await _dbContext.Bookmarks.Where(b => b.UserId == userId).ToListAsync();
    }

    public async Task<Bookmark> GetBookmarkByIdAsync(int id)
    {
        return await _dbContext.Bookmarks.FindAsync(id);
    }

    public async Task<bool> DeleteBookmarkAsync(int id)
    {
        try
        {
            var bookmark = await _dbContext.Bookmarks.FindAsync(id);

            if (bookmark == null)
            {
                return false;
            }

            _dbContext.Bookmarks.Remove(bookmark);

            await _dbContext.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error deleting bookmark: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> UpdateTranslatedTextAsync(int id, string translatedText)
    {
        try
        {
            var bookmark = await _dbContext.Bookmarks.FindAsync(id);

            if (bookmark == null)
            {
                return false;
            }

            bookmark.Text = translatedText;

            await _dbContext.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error updating translated text: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> UpdateSummarizerTextAsync(int id, string text)
    {
        try
        {
            var existingBookmark = await _dbContext.Bookmarks.FirstOrDefaultAsync(b => b.Id == id);

            if (existingBookmark == null)
            {
                return false;
            }

            existingBookmark.Text = text;

            await _dbContext.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error updating summarizer text: {ex.Message}");
            throw;
        }
    }
}