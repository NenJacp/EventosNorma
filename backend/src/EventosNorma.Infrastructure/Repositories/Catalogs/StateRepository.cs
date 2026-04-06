using EventosNorma.Domain.Catalogs;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Infrastructure.Repositories;

public class StateRepository : IStateRepository
{
    private readonly AppDbContext _context;

    public StateRepository(AppDbContext context) => _context = context;

    public async Task<State?> GetByIdAsync(int id) => await _context.States.FindAsync(id);

    public async Task<IEnumerable<State>> GetAllAsync(bool onlyActive = true)
    {
        var query = _context.States.AsQueryable();
        if (onlyActive) query = query.Where(s => s.IsActive);
        return await query.ToListAsync();
    }

    public async Task<IEnumerable<State>> GetByCountryIdAsync(int countryId, bool onlyActive = true)
    {
        var query = _context.States.Where(s => s.CountryId == countryId);
        if (onlyActive) query = query.Where(s => s.IsActive);
        return await query.ToListAsync();
    }

    public async Task UpdateAsync(State state)
    {
        _context.States.Update(state);
        await Task.CompletedTask;
    }

    public async Task AddAsync(State state) => await _context.States.AddAsync(state);

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}
