using EventosNorma.Domain.Entities;

namespace EventosNorma.Domain.Interfaces;

public interface IJwtProvider
{
    string Generate(User user);
}
