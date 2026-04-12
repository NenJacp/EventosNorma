using System.Text.Json.Serialization;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public record VerifyEmailCommand(
    [property: JsonPropertyName("email")] string Email, 
    [property: JsonPropertyName("token")] string Code
);