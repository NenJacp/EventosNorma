using EventosNorma.Domain.Entities;

namespace EventosNorma.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task AddAsync(User user);
}
