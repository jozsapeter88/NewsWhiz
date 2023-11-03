/* using Microsoft.EntityFrameworkCore;
using server.Models.DBContext;
using server.Services;

public class Startup
{
    public IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        // Add Entity Framework Core with PostgreSQL using the connection string from appsettings.json
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"));
            options.EnableSensitiveDataLogging();
        });
        services.AddControllers();
        
        services.AddScoped<INewsSiteService, NewsSiteService>();
        
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder.WithOrigins("http://192.168.56.1:3000", "http://localhost:3000") // Add your frontend URL here
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });

        // Add other services, dependencies, and configurations as needed
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            // Configure production-specific error handling
            app.UseExceptionHandler("/Home/Error");
            app.UseHsts();
        }

        // Seed data into the database when the application starts
        using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
        {
            var dbContext = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            DataSeed.Initialize(dbContext);
        }

        app.UseCors();

        // Configure other middleware, routing, and endpoints
    }
}
*/