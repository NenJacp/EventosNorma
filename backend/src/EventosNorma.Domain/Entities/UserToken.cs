using EventosNorma.Domain.Enums;

namespace EventosNorma.Domain.Entities;

public class UserToken
{
    public int Id { get; private set; }
    public string Token { get; private set; } = string.Empty;
    public UserTokenType Type { get; private set; }
    public DateTime ExpiresAt { get; private set; }
    public bool IsUsed { get; private set; }
    public int UserId { get; private set; }
    public User User { get; private set; } = null!;

    private UserToken() { }

    public static UserToken Create(int userId, string token, UserTokenType type, int expirationHours = 24)
    {
        return new UserToken
        {
            UserId = userId,
            Token = token,
            Type = type,
            ExpiresAt = DateTime.UtcNow.AddHours(expirationHours),
            IsUsed = false
        };
    }

    public void Use() => IsUsed = true;
    public bool IsExpired => DateTime.UtcNow > ExpiresAt;
}
