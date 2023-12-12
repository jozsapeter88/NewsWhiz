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

    public async Task<int> SaveBookmarkAsync(string name, string text, string userId)
    {
        var bookmark = new Bookmark { Name = name, Text = text, UserId = userId };
        _dbContext.Bookmarks.Add(bookmark);
        await _dbContext.SaveChangesAsync();
        return bookmark.Id;
    }

    public async Task<IEnumerable<Bookmark>> GetBookmarksAsync(string userId)
    {
        return await _dbContext.Bookmarks.Where(b => b.UserId == userId).ToListAsync();
    }
}