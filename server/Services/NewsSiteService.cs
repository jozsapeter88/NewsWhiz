using server.Models;
using server.Models.DBContext;
using server.Services;

public class NewsSiteService : INewsSiteService
{
    private readonly ApplicationDbContext _context;

    public NewsSiteService(ApplicationDbContext context)
    {
        _context = context;
    }

    public List<NewsSite> GetAllNewsSites()
    {
        return _context.NewsSites.ToList();
    }
}