using EventosNorma.Domain.Catalogs;

namespace EventosNorma.Domain.Interfaces;

public interface ICityRepository
{
    Task<City?> GetByIdAsync(int id);
    Task<IEnumerable<City>> GetAllAsync(bool onlyActive = true);
    Task<IEnumerable<City>> GetByStateIdAsync(int stateId, bool onlyActive = true);
    Task AddAsync(City city);
    Task UpdateAsync(City city);
    Task SaveChangesAsync();
}
