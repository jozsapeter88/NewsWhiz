﻿using Microsoft.EntityFrameworkCore;
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

    public async Task<IEnumerable<Bookmark>> GetBookmarksAsync(string userId)
    {
        return await _dbContext.Bookmarks.Where(b => b.UserId == userId).ToListAsync();
    }
    
    public async Task<Bookmark> GetBookmarkByIdAsync(int id)
    {
        return await _dbContext.Bookmarks.FindAsync(id);
    }
}