namespace EventosNorma.Domain.Catalogs;

using EventosNorma.Domain.Interfaces;
using System.Text.RegularExpressions;

public partial class State : IAuditableEntity
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

    // 4. Relaciones / FKs
    public int CountryId { get; private set; }

    // 5. Auditoría
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // 6. Navegación
    public Country Country { get; private set; } = null!;
    public ICollection<City> Cities { get; private set; } = [];

    // --- Constructor ---
    private State() { }

    // --- Fábrica (Factory) ---
    public static State Create(string name, string? code, int countryId)
    {
        ValidateName(name);
        ValidateFK(countryId, nameof(CountryId));

        return new State
        {
            Name = name.Trim(),
            Code = !string.IsNullOrWhiteSpace(code) ? code.Trim().ToUpper() : "Sin código",
            CountryId = countryId,
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

    public void ChangeCountry(int countryId)
    {
        ValidateFK(countryId, nameof(CountryId));
        if (CountryId == countryId) return;

        CountryId = countryId;
    }

    // --- Validaciones Privadas ---
    private static void ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("El nombre del estado es requerido.");
        
        var trimmedName = name.Trim();
        if (trimmedName.Length < 2) throw new ArgumentException("El nombre del estado es demasiado corto.");
        
        if (!NameRegex().IsMatch(trimmedName)) 
            throw new ArgumentException("El nombre del estado solo puede contener letras y espacios.");
    }

    private static void ValidateFK(int id, string paramName)
    {
        if (id <= 0) throw new ArgumentException($"El campo {paramName} es requerido.");
    }
}
