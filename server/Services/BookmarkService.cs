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
            // Check if the bookmark with the given id exists
            var existingBookmark = await _dbContext.Bookmarks.FirstOrDefaultAsync(b => b.Id == id);

            if (existingBookmark == null)
            {
                return false; // Bookmark with the given ID not found
            }

            // Ensure the UserId is the same as the current user's Id
            if (!string.IsNullOrEmpty(request.UserId) && request.UserId != userId)
            {
                return false; // Invalid UserId
            }

            // Only update the 'Text' property if it is different from the original
            if (!string.IsNullOrEmpty(request.Text) && existingBookmark.Text != request.Text)
            {
                existingBookmark.Text = request.Text;
                await _dbContext.SaveChangesAsync();
            }

            return true; // Bookmark edited successfully
        }
        catch (Exception ex)
        {
            // Log the error to a more comprehensive logging system
            Console.Error.WriteLine($"Error updating bookmark: {ex.Message}");
            return false; // Internal Server Error
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
}