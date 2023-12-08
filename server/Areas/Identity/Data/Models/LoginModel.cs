using System.ComponentModel.DataAnnotations;

namespace server.Areas.Identity.Data.Models;

public class LoginModel
{
    [Microsoft.Build.Framework.Required]
    public string UserName { get; set; }

    [Microsoft.Build.Framework.Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }

    [Display(Name = "Remember me")]
    public bool RememberMe { get; set; }
}