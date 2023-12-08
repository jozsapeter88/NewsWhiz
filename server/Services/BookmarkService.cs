using Microsoft.EntityFrameworkCore;
using server.Areas.Identity.Data.Models;
using server.Models.DBContext;

namespace server.Services;

public class BookmarkService : IBookmarkService
{
    private readonly ApplicationDbContext _dbContext;
    
    public BookmarkService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<int> SaveBookmarkAsync(string text)
    {
        var bookmark = new Bookmark { Text = text };
        _dbContext.Bookmarks.Add(bookmark);
        await _dbContext.SaveChangesAsync();
        return bookmark.Id;
    }

    public async Task<IEnumerable<Bookmark>> GetBookmarksAsync()
    {
        return await _dbContext.Bookmarks.ToListAsync();
    }
}