using Microsoft.AspNetCore.Mvc;
using server.Areas.Identity.Data.Models;
using server.Areas.Identity.Enum;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController: ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }
    
    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody]RegisterModel model)
    {
        Console.WriteLine(model.UserName);
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var user = new User { UserName = model.UserName, Email = model.Email, Role = RoleEnum.User};
        var result = await _userService.RegisterUserAsync(user, model.Password);

        if (result.Succeeded)
        {
            return Ok();
        }
        return BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody]LoginModel model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var result = await _userService.SignInAsync(model.UserName, model.Password, model.RememberMe);

        if (!result.Succeeded) return BadRequest("Login failed.");
        var user = await _userService.GetUserByName(model.UserName);
        
        return Ok(user);
    }

    [HttpGet("getUsers")]
    public async Task<ActionResult<List<User>>> GetAll()
    {
        var result = await _userService.GetAllUsers();
        if (result is not null) return Ok(result);
        return NotFound("No users found");
    }
    
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<User>>> GetUser()
    {
        var result = await _userService.GetAllUsers();
        if (result is null) return NotFound("No User Found");
        return Ok(result);
    }
    
}