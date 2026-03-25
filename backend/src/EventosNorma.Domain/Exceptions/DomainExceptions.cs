namespace EventosNorma.Domain.Exceptions;

public abstract class DomainException : Exception
{
    protected DomainException(string message) : base(message) { }
}

public class UserAlreadyExistsException : DomainException
{
    public UserAlreadyExistsException(string email) 
        : base($"El usuario con el correo '{email}' ya se encuentra registrado.") { }
}
