using Microsoft.AspNetCore.Identity;
using server.Areas.Identity.Enum;

namespace server.Areas.Identity.Data.Models;

public class Role: IdentityRole
{
    public RoleEnum RoleEnum { get; set; }
}