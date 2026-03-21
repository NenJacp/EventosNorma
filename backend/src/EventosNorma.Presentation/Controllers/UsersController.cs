using EventosNorma.Application.DTOs;
using EventosNorma.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EventosNorma.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterRequest request)
    {
        try
        {
            var response = await _userService.RegisterAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginRequest request)
    {
        var response = await _userService.LoginAsync(request);
        if (response == null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _userService.DeleteUserAsync(id);
        if (!result)
        {
            return NotFound(new { message = "User not found" });
        }

        return NoContent();
    }
}
