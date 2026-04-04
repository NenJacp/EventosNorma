using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Enums;

namespace EventosNorma.Domain.Interfaces;

public interface IUserTokenRepository
{
    Task<UserToken?> GetByTokenAsync(string token, UserTokenType type);
    Task AddAsync(UserToken token);
    Task SaveChangesAsync();
}
