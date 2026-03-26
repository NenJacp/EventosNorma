using EventosNorma.Application.Features.Users.Commands;
using EventosNorma.Application.Features.Users.Queries;
using EventosNorma.Application.Features.Users.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace EventosNorma.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMessageBus _bus;

    public UsersController(IMessageBus bus)
    {
        _bus = bus;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserCommand command)
    {
        var response = await _bus.InvokeAsync<UserViewModel>(command);
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginQuery query)
    {
        var response = await _bus.InvokeAsync<LoginViewModel>(query);
        return Ok(response);
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _bus.InvokeAsync<IEnumerable<UserViewModel>>(new GetAllUsersQuery());
        return Ok(users);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] DeleteUserCommand command)
    {
        await _bus.InvokeAsync(command);
        return Ok(new { message = "Usuario desactivado correctamente" });
    }
}
