using System.Text.Json.Serialization;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public record VerifyPasswordCodeCommand(
    [property: JsonPropertyName("email")] string Email, 
    [property: JsonPropertyName("code")] string Code
);