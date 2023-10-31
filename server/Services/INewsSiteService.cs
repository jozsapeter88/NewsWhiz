using server.Models;

namespace server.Services;

public interface INewsSiteService
{
    List<NewsSite> GetAllNewsSites();
}