using Microsoft.AspNetCore.Identity;
using server.Areas.Identity.Data.Models;

namespace server.Services;

public interface IUserService
{
    Task<IdentityResult> RegisterUserAsync(User user, string password);
    Task<SignInResult> SignInAsync(string userName, string password, bool rememberMe);
    Task<User?> GetUserByName(string userName);
    Task<List<User>?> GetAllUsers();
}