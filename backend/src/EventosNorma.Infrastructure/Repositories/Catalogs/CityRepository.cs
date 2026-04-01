using EventosNorma.Domain.Catalogs;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Infrastructure.Repositories;

public class CityRepository : ICityRepository
{
    private readonly AppDbContext _context;

    public CityRepository(AppDbContext context) => _context = context;

    public async Task<City?> GetByIdAsync(int id) => await _context.Cities.FindAsync(id);

    public async Task<IEnumerable<City>> GetByStateIdAsync(int stateId, bool onlyActive = true)
    {
        var query = _context.Cities.Where(c => c.StateId == stateId);
        if (onlyActive) query = query.Where(c => c.IsActive);
        return await query.ToListAsync();
    }

    public async Task UpdateAsync(City city)
    {
        _context.Cities.Update(city);
        await Task.CompletedTask;
    }

    public async Task AddAsync(City city) => await _context.Cities.AddAsync(city);

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}
