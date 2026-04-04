using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Domain.Enums;
using EventosNorma.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Infrastructure.Repositories;

public class UserTokenRepository : IUserTokenRepository
{
    private readonly AppDbContext _context;

    public UserTokenRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserToken?> GetByTokenAsync(string token, UserTokenType type)
    {
        return await _context.UserTokens
            .Include(ut => ut.User)
            .FirstOrDefaultAsync(ut => ut.Token == token && ut.Type == type && !ut.IsUsed);
    }

    public async Task AddAsync(UserToken token)
    {
        await _context.UserTokens.AddAsync(token);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
