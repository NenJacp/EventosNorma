namespace EventosNorma.Domain.Catalogs;

using EventosNorma.Domain.Interfaces;
using System.Text.RegularExpressions;

public partial class Country : IAuditableEntity
{
    // --- Campos Estáticos (Optimizaciones de Memoria) ---
    [GeneratedRegex(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$")]
    private static partial Regex NameRegex();

    // 1. Identidad
    public int Id { get; private set; }

    // 2. Datos
    public string Name { get; private set; } = string.Empty;
    public string Code { get; private set; } = "Sin código";

    // 3. Estado Lógico
    public bool IsActive { get; private set; }

    // 4. Auditoría
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // 5. Navegación
    public ICollection<State> States { get; private set; } = [];

    // --- Constructor ---
    private Country() { }

    // --- Fábrica (Factory) ---
    public static Country Create(string name, string? code)
    {
        ValidateName(name);

        return new Country
        {
            Name = name.Trim(),
            Code = !string.IsNullOrWhiteSpace(code) ? code.Trim().ToUpper() : "Sin código",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
    }

    // --- Métodos de Cambio de Estado ---
    public void Deactivate()
    {
        if (!IsActive) return;
        IsActive = false;
    }

    public void ChangeInfo(string? name, string? code)
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

        if (code != null)
        {
            var trimmedCode = string.IsNullOrWhiteSpace(code) ? "Sin código" : code.Trim().ToUpper();
            if (!string.Equals(Code, trimmedCode, StringComparison.Ordinal))
            {
                Code = trimmedCode;
            }
        }
    }

    // --- Validaciones Privadas ---
    private static void ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("El nombre del país es requerido.");
        
        var trimmedName = name.Trim();
        if (trimmedName.Length < 3) throw new ArgumentException("El nombre del país es demasiado corto.");
        
        if (!NameRegex().IsMatch(trimmedName)) 
            throw new ArgumentException("El nombre del país solo puede contener letras y espacios.");
    }
}
