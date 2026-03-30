namespace EventosNorma.Domain.Entities;

using EventosNorma.Domain.Enums;
using EventosNorma.Domain.Catalogs;
using EventosNorma.Domain.Associations;
using EventosNorma.Domain.Interfaces;

public class Event : IAuditableEntity
{
    // 1. Identidad
    public int Id { get; private set; }

    // 2. Datos
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = "Sin descripción";
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public string LocationDetail { get; private set; } = "Sin detalles";
    public bool IsPrivate { get; private set; }
    public int MaxCapacity { get; private set; }

    // 3. Estado Lógico
    public EventStatus Status { get; private set; }
    public bool IsActive { get; private set; }

    // 4. Relaciones / FKs
    public int CityId { get; private set; }
    public int CreatedById { get; private set; }

    // 5. Auditoría
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // 6. Navegación
    public City City { get; private set; } = null!;
    public User Creator { get; private set; } = null!;
    public ICollection<EventMember> Members { get; private set; } = [];

    // --- Constructor ---
    private Event() { }

    // --- Fábrica (Factory) ---
    public static Event Create(string title, string? description, DateTime startDate, DateTime endDate, string? locationDetail, int cityId, bool isPrivate, int createdById, int maxCapacity)
    {
        ValidateTitle(title);
        ValidateDates(startDate, endDate);
        ValidateFK(cityId, nameof(CityId));
        ValidateFK(createdById, nameof(CreatedById));
        ValidateCapacity(maxCapacity, nameof(MaxCapacity));

        return new Event
        {
            Title = title.Trim(),
            Description = !string.IsNullOrWhiteSpace(description) ? description.Trim() : "Sin descripción",
            StartDate = startDate,
            EndDate = endDate,
            LocationDetail = !string.IsNullOrWhiteSpace(locationDetail) ? locationDetail.Trim() : "Sin detalles del lugar",
            CityId = cityId,
            MaxCapacity = maxCapacity,
            IsPrivate = isPrivate,
            CreatedById = createdById,
            Status = EventStatus.Open,
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

    public void Activate()
    {
        if (IsActive) return;
        IsActive = true;
    }

    public void ChangeInfo(string? title, string? description, string? locationDetail, DateTime? startDate, DateTime? endDate)
    {
        if (!string.IsNullOrWhiteSpace(title))
        {
            var trimmedTitle = title.Trim();
            if (!string.Equals(Title, trimmedTitle, StringComparison.Ordinal))
            {
                ValidateTitle(trimmedTitle);
                Title = trimmedTitle;
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

        if (locationDetail != null)
        {
            var trimmedLoc = string.IsNullOrWhiteSpace(locationDetail) ? "Sin detalles" : locationDetail.Trim();
            if (!string.Equals(LocationDetail, trimmedLoc, StringComparison.Ordinal))
            {
                LocationDetail = trimmedLoc;
            }
        }

        if (startDate.HasValue || endDate.HasValue)
        {
            var start = startDate ?? StartDate;
            var end = endDate ?? EndDate;
            ValidateDates(start, end);

            if (startDate.HasValue) StartDate = startDate.Value;
            if (endDate.HasValue) EndDate = endDate.Value;
        }
    }

    public void ChangeCity(int cityId)
    {
        ValidateFK(cityId, nameof(CityId));
        if (CityId == cityId) return;

        CityId = cityId;
    }

    public void ChangeStatus(EventStatus status)
    {
        if (Status == status) return;
        Status = status;
    }

    public void ChangePrivacy(bool isPrivate)
    {
        if (IsPrivate == isPrivate) return;
        IsPrivate = isPrivate;
    }

    public void ChangeCapacity(int newMaxCapacity)
    {
        ValidateCapacity(newMaxCapacity, nameof(MaxCapacity));

        var currentActiveMembers = Members.Count(m => m.ExitedAt == null);

        if (newMaxCapacity < currentActiveMembers)
        {
            throw new InvalidOperationException($"La nueva capacidad ({newMaxCapacity}) no puede ser menor al número de miembros actuales ({currentActiveMembers}).");
        }

        if (MaxCapacity == newMaxCapacity) return;

        MaxCapacity = newMaxCapacity;
    }

    // --- Validaciones Privadas ---
    private static void ValidateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title)) throw new ArgumentException("El título del evento es requerido.");
        if (title.Trim().Length < 5) throw new ArgumentException("El título es demasiado corto.");
    }

    private static void ValidateDates(DateTime start, DateTime end)
    {
        if (end <= start) throw new ArgumentException("La fecha de finalización debe ser posterior a la de inicio.");
    }

    private static void ValidateFK(int id, string paramName)
    {
        if (id <= 0) throw new ArgumentException($"El campo {paramName} es requerido.");
    }

    private static void ValidateCapacity(int maxCapacity, string paramName)
    {
        if (maxCapacity <= 0) throw new ArgumentException($"El campo {paramName} debe ser mayor a cero.", paramName);
    }
}
