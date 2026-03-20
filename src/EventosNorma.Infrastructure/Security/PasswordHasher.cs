using EventosNorma.Application.Interfaces;
using BCryptNet = BCrypt.Net.BCrypt;

namespace EventosNorma.Infrastructure.Security;

public class PasswordHasher : IPasswordHasher
{
    public string Hash(string password)
    {
        return BCryptNet.HashPassword(password);
    }

    public bool Verify(string password, string passwordHash)
    {
        return BCryptNet.Verify(password, passwordHash);
    }
}
