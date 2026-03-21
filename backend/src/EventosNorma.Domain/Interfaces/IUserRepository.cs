using EventosNorma.Domain.Entities;

namespace EventosNorma.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(int id);
    Task<IEnumerable<User>> GetAllAsync();
    Task AddAsync(User user);
    void Delete(User user);
}
