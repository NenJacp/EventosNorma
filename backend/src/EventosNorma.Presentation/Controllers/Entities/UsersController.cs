using EventosNorma.Application.Common.Models;
using EventosNorma.Application.Features.Entities.Users.Commands;
using EventosNorma.Application.Features.Entities.Users.Queries;
using EventosNorma.Application.Features.Entities.Users.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        return Created($"/api/users/{response.Id}", ApiResponse<UserViewModel>.Ok(response));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginQuery query)
    {
        var response = await _bus.InvokeAsync<LoginViewModel>(query);
        return Ok(ApiResponse<LoginViewModel>.Ok(response));
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail(VerifyEmailCommand command)
    {
        await _bus.InvokeAsync(command);
        return Ok(ApiResponse<object>.Ok(null, "Correo electrónico verificado con éxito."));
    }

    [HttpPost("logout")]
    public IActionResult Logout([FromServices] IHttpContextAccessor httpContextAccessor)
    {
        httpContextAccessor.HttpContext?.Response.Cookies.Delete("jwt");
        return Ok(ApiResponse<object>.Ok(null, "Sesión cerrada correctamente"));
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordCommand command)
    {
        await _bus.InvokeAsync(command);
        return Ok(ApiResponse<object>.Ok(null, "Si el correo electrónico existe en nuestro sistema, se ha enviado un enlace para restablecer la contraseña."));
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordCommand command)
    {
        await _bus.InvokeAsync(command);
        return Ok(ApiResponse<object>.Ok(null, "La contraseña se ha actualizado correctamente."));
    }

    [Authorize]
    [HttpGet("currentUser")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var user = await _bus.InvokeAsync<CurrentUserViewModel>(new GetCurrentUserQuery());
        return Ok(ApiResponse<CurrentUserViewModel>.Ok(user));
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _bus.InvokeAsync<IEnumerable<UserViewModel>>(new GetAllUsersQuery());
        return Ok(ApiResponse<IEnumerable<UserViewModel>>.Ok(users));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] DeleteUserCommand command)
    {
        await _bus.InvokeAsync(command);
        return Ok(ApiResponse<object>.Ok(null, "Usuario desactivado correctamente"));
    }

    [Authorize]
    [HttpPost("{id}/profile-image")]
    public async Task<IActionResult> UpdateProfileImage(int id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(ApiResponse<object>.Fail("No se proporcionó un archivo válido."));

        using var stream = file.OpenReadStream();
        var command = new UpdateUserProfileImageCommand(id, stream, file.FileName);
        var imageUrl = await _bus.InvokeAsync<string>(command);

        return Ok(ApiResponse<object>.Ok(new { imageUrl }, "Imagen de perfil actualizada correctamente."));
    }
}
