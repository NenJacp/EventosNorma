using EventosNorma.Domain.Catalogs;

namespace EventosNorma.Domain.Interfaces;

public interface ICountryRepository
{
    Task<Country?> GetByIdAsync(int id);
    Task<IEnumerable<Country>> GetAllAsync(bool onlyActive = true);
    Task AddAsync(Country country);
    Task UpdateAsync(Country country);
    Task SaveChangesAsync();
}
