using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using server.Areas.Identity.Data.Models;

namespace server.Models.DBContext
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<NewsSite> NewsSites { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Additional configuration or DbSet properties can be added here if needed

        // No need for the OnConfiguring method when using a constructor to pass options
    }
}