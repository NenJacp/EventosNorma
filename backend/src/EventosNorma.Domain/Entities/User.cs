namespace EventosNorma.Domain.Entities;

public class User
{
    public int Id { get; private set; }
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public bool IsActive { get; private set; } = true;

    private User() { } // Para EF Core

    public static User Create(string firstName, string lastName, string email, string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(firstName)) throw new ArgumentException("El nombre es requerido.", nameof(firstName));
        if (string.IsNullOrWhiteSpace(lastName)) throw new ArgumentException("El apellido es requerido.", nameof(lastName));
        if (string.IsNullOrWhiteSpace(email)) throw new ArgumentException("El correo es requerido.", nameof(email));
        if (string.IsNullOrWhiteSpace(passwordHash)) throw new ArgumentException("La contraseña es requerida.", nameof(passwordHash));

        return new User
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PasswordHash = passwordHash,
            IsActive = true
        };
    }

    public void Deactivate() => IsActive = false;
}
