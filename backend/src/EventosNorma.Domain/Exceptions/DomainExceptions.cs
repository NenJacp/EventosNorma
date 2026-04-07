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

public class UserNotFoundException : DomainException
{
    public UserNotFoundException(string email) 
        : base($"No existe ningún usuario registrado con el correo '{email}'.") { }
}
