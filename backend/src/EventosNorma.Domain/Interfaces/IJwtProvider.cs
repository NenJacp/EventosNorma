namespace EventosNorma.Domain.Interfaces;
using EventosNorma.Domain.Entities;

public interface IJwtProvider
{
    string Generate(User user);
}
