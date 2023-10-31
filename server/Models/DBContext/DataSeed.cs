using server.Models;
using server.Models.DBContext;

public class DataSeed
{
    public static void Initialize(ApplicationDbContext dbContext)
    {
        if (!dbContext.NewsSites.Any())
        {
            var newsSites = new[]
            {
                new NewsSite
                {
                    Name = "BBC",
                    TitleXPath = "//h1[@class='article-headline__text b-reith-sans-font b-font-weight-300']",
                    ArticleXPath = "//div[@class='article__body-content']"
                },
                new NewsSite
                {
                    Name = "Index",
                    TitleXPath = "//div[@class='content-title']",
                    ArticleXPath = "//div[@class='cikk-torzs']"
                }
            };

            dbContext.NewsSites.AddRange(newsSites);
            dbContext.SaveChanges();
        }
    }
}