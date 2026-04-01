using EventosNorma.Domain.Catalogs;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Infrastructure.Repositories;

public class CountryRepository : ICountryRepository
{
    private readonly AppDbContext _context;

    public CountryRepository(AppDbContext context) => _context = context;

    public async Task<Country?> GetByIdAsync(int id) => await _context.Countries.FindAsync(id);

    public async Task<IEnumerable<Country>> GetAllAsync(bool onlyActive = true)
    {
        var query = _context.Countries.AsQueryable();
        if (onlyActive) query = query.Where(c => c.IsActive);
        return await query.ToListAsync();
    }

    public async Task UpdateAsync(Country country)
    {
        _context.Countries.Update(country);
        await Task.CompletedTask;
    }

    public async Task AddAsync(Country country) => await _context.Countries.AddAsync(country);

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}
