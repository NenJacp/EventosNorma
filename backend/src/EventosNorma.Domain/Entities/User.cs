namespace EventosNorma.Domain.Entities;

using EventosNorma.Domain.Associations;
using EventosNorma.Domain.Enums;
using EventosNorma.Domain.Interfaces;
using System.Text.RegularExpressions;

public partial class User : IAuditableEntity
{
    // --- Campos Estáticos (Optimizaciones de Memoria) ---

    [GeneratedRegex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$")]
    private static partial Regex EmailRegex();

    [GeneratedRegex(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$")]
    private static partial Regex NameRegex();

    // 1. Identidad
    public int Id { get; private set; }

    // 2. Datos
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;

    // 3. Estado Lógico
    public UserRole Role { get; private set; } = UserRole.User;
    public bool IsActive { get; private set; } = true;
    public bool IsBanned { get; private set; } = false;
    public string? BanReason { get; private set; }
    public DateTime? BannedAt { get; private set; }

    // 4. Auditoría
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // 5. Navegación
    public ICollection<EventMember> EventMemberships { get; private set; } = [];

    // --- Constructor ---
    private User() { }

    // --- Fábrica (Factory) ---
    public static User Create(string firstName, string lastName, string email, string passwordHash, UserRole role = UserRole.User)
    {
        ValidateName(firstName, nameof(firstName));
        ValidateName(lastName, nameof(lastName));
        ValidateEmail(email);
        ValidatePasswordHash(passwordHash);

        return new User
        {
            FirstName = firstName.Trim(),
            LastName = lastName.Trim(),
            Email = email.ToLower().Trim(),
            PasswordHash = passwordHash,
            Role = role,
            IsActive = true,
            IsBanned = false,
            CreatedAt = DateTime.UtcNow
        };
    }

    // --- Métodos de Cambio de Estado ---
    public void Deactivate()
    {
        if (!IsActive) return;
        IsActive = false;
    }

    public void Activate()
    {
        if (IsBanned) throw new InvalidOperationException("No se puede activar un usuario que está baneado.");
        if (IsActive) return;

        IsActive = true;
    }

    public void Ban(string reason)
    {
        if (IsBanned) return;

        IsBanned = true;
        BanReason = !string.IsNullOrWhiteSpace(reason) ? reason.Trim() : "No se especificó un motivo.";
        BannedAt = DateTime.UtcNow;
        IsActive = false;
    }

    public void Unban()
    {
        if (!IsBanned) return;

        IsBanned = false;
        BanReason = null;
        BannedAt = null;
    }

    public void ChangeRole(UserRole newRole)
    {
        if (Role == newRole) return;
        Role = newRole;
    }

    public void ChangeInfo(string? firstName, string? lastName)
    {
        if (!string.IsNullOrWhiteSpace(firstName))
        {
            ValidateName(firstName, nameof(firstName));
            var newFirst = firstName.Trim();
            if (FirstName != newFirst) FirstName = newFirst;
        }

        if (!string.IsNullOrWhiteSpace(lastName))
        {
            ValidateName(lastName, nameof(lastName));
            var newLast = lastName.Trim();
            if (LastName != newLast) LastName = newLast;
        }
    }

    public void ChangeEmail(string email)
    {
        ValidateEmail(email);
        var newEmail = email.ToLower().Trim();
        if (string.Equals(Email, newEmail, StringComparison.Ordinal)) return;

        Email = newEmail;
    }

    public void ChangePassword(string passwordHash)
    {
        ValidatePasswordHash(passwordHash);
        if (string.Equals(PasswordHash, passwordHash, StringComparison.Ordinal)) return;

        PasswordHash = passwordHash;
    }

    // --- Validaciones Privadas ---
    private static void ValidateName(string name, string paramName)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("El nombre es requerido.", paramName);

        var trimmedName = name.Trim();
        if (trimmedName.Length < 2) throw new ArgumentException("El nombre es demasiado corto.", paramName);

        if (!NameRegex().IsMatch(trimmedName))
            throw new ArgumentException("El nombre solo puede contener letras y espacios.", paramName);
    }

    private static void ValidateEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) throw new ArgumentException("El email es requerido.");
        if (!EmailRegex().IsMatch(email)) throw new ArgumentException("El formato del email es inválido.");
    }

    private static void ValidatePasswordHash(string hash)
    {
        if (string.IsNullOrWhiteSpace(hash)) throw new ArgumentException("La contraseña es requerida.");
    }
}
