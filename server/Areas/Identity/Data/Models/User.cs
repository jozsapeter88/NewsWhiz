using Microsoft.AspNetCore.Identity;
using server.Areas.Identity.Enum;

namespace server.Areas.Identity.Data.Models;

public class User : IdentityUser
{
    public RoleEnum Role { get; set; }
}

