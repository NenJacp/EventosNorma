using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == id && u.IsActive);
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users.Where(u => u.IsActive).ToListAsync();
    }

    public async Task AddAsync(User user)
    {
        user.IsActive = true;
        await _context.Users.AddAsync(user);
    }

    public void Delete(User user)
    {
        user.IsActive = false;
        _context.Users.Update(user);
    }
}
