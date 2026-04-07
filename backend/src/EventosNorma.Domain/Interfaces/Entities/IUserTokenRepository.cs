using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Enums;

namespace EventosNorma.Domain.Interfaces;

public interface IUserTokenRepository
{
    Task<UserToken?> GetByCodeAsync(string code, UserTokenType type);
    Task AddAsync(UserToken token);
    Task SaveChangesAsync();
}
