using EventosNorma.Domain.Catalogs;

namespace EventosNorma.Domain.Interfaces;

public interface IStateRepository
{
    Task<State?> GetByIdAsync(int id);
    Task<IEnumerable<State>> GetByCountryIdAsync(int countryId, bool onlyActive = true);
    Task AddAsync(State state);
    Task UpdateAsync(State state);
    Task SaveChangesAsync();
}
