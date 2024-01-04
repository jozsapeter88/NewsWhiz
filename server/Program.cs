using System.Configuration;
using Microsoft.EntityFrameworkCore;
using server.Models.DBContext;
using server.Services;
using Microsoft.AspNetCore.Identity;
using server.Areas.Identity.Data.Models;
using server.Areas.Identity.Enum;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://192.168.56.1:3000")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddTransient<INewsSiteService, NewsSiteService>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IBookmarkService, BookmarkService>();

var app = builder.Build();

using (var serviceScope = app.Services.CreateScope())
{
    var context = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    try
    {
        DataSeed.Initialize(context);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error during database seeding: {ex.Message}");
    }
}

//Add adminUser
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    if (!await roleManager.RoleExistsAsync("Admin"))
    {
        var adminRole = new IdentityRole("Admin");
        await roleManager.CreateAsync(adminRole);
    }

    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    var adminUser = new User
    {
        UserName = "admin",
        Email = "admin@example.com",
        Role = RoleEnum.Admin
    };

    var result = await userManager.CreateAsync(adminUser, "Admin1234!");
    if (result.Succeeded)
    {
        await userManager.AddToRoleAsync(adminUser, "Admin");
    }
}

app.UseAuthentication();
app.UseCors();
app.MapControllers();
app.Run();