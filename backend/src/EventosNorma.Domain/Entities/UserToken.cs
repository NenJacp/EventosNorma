using EventosNorma.Domain.Enums;

namespace EventosNorma.Domain.Entities;

public class UserToken
{
    // 1. Identidad
    public int Id { get; private set; }

    // 2. Datos
    public string Code { get; private set; } = string.Empty;
    public UserTokenType Type { get; private set; }
    public DateTime ExpiresAt { get; private set; }

    // 3. Estado Lógico
    public bool IsUsed { get; private set; }
    public DateTime? RevokedAt { get; private set; }
    public string? ReplacedByToken { get; private set; }
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsActive => !IsUsed && RevokedAt == null && !IsExpired;

    // 4. Relaciones / FKs
    public int UserId { get; private set; }

    // 5. Navegación
    public User User { get; private set; } = null!;

    // --- Constructor ---
    private UserToken() { }

    // --- Fábrica (Factory) ---
    public static UserToken Create(int userId, string code, UserTokenType type, int expirationHours = 24)
    {
        return new UserToken
        {
            UserId = userId,
            Code = code,
            Type = type,
            ExpiresAt = DateTime.UtcNow.AddHours(expirationHours),
            IsUsed = false
        };
    }

    // --- Métodos de Cambio de Estado ---
    public void Use() => IsUsed = true;
    
    public void Revoke(string? replacedByToken = null)
    {
        RevokedAt = DateTime.UtcNow;
        ReplacedByToken = replacedByToken;
    }
}