namespace EventosNorma.Domain.Catalogs;

using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Interfaces;

public class EventType : IAuditableEntity
{
    // 1. Identidad
    public int Id { get; private set; }

    // 2. Datos
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = "Sin descripción";

    // 3. Estado Lógico
    public bool IsActive { get; private set; } = true;

    // 4. Auditoría
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // 5. Navegación
    public ICollection<Event> Events { get; private set; } = [];

    // --- Constructor ---
    private EventType() { }

    // --- Fábrica (Factory) ---
    public static EventType Create(string name, string? description)
    {
        ValidateName(name);

        return new EventType
        {
            Name = name.Trim(),
            Description = !string.IsNullOrWhiteSpace(description) ? description.Trim() : "Sin descripción",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
    }

    // --- Métodos de Cambio de Estado ---
    public void Deactivate() => IsActive = false;
    public void Activate() => IsActive = true;

    public void ChangeInfo(string? name, string? description)
    {
        if (!string.IsNullOrWhiteSpace(name))
        {
            var trimmedName = name.Trim();
            if (!string.Equals(Name, trimmedName, StringComparison.Ordinal))
            {
                ValidateName(trimmedName);
                Name = trimmedName;
            }
        }

        if (description != null)
        {
            var trimmedDesc = string.IsNullOrWhiteSpace(description) ? "Sin descripción" : description.Trim();
            if (!string.Equals(Description, trimmedDesc, StringComparison.Ordinal))
            {
                Description = trimmedDesc;
            }
        }
    }

    // --- Validaciones Privadas ---
    private static void ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("El nombre del tipo es requerido.");
        if (name.Trim().Length < 3) throw new ArgumentException("El nombre del tipo es demasiado corto.");
    }
}
