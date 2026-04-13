using EventosNorma.Application.Common.Models;
using EventosNorma.Domain.Catalogs;
using EventosNorma.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventosNorma.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class CatalogsController : ControllerBase
{
    private readonly ICountryRepository _countryRepo;
    private readonly IStateRepository _stateRepo;
    private readonly ICityRepository _cityRepo;
    private readonly IEventTypeRepository _eventTypeRepo;
    private readonly IEventCategoryRepository _eventCategoryRepo;

    public CatalogsController(
        ICountryRepository countryRepo,
        IStateRepository stateRepo,
        ICityRepository cityRepo,
        IEventTypeRepository eventTypeRepo,
        IEventCategoryRepository eventCategoryRepo)
    {
        _countryRepo = countryRepo;
        _stateRepo = stateRepo;
        _cityRepo = cityRepo;
        _eventTypeRepo = eventTypeRepo;
        _eventCategoryRepo = eventCategoryRepo;
    }

    [HttpGet("countries")]
    public async Task<IActionResult> GetCountries([FromQuery] bool includeInactive = false)
    {
        var countries = await _countryRepo.GetAllAsync(!includeInactive);
        var response = countries.Select(c => new {
            c.Id,
            c.Name,
            c.Code,
            c.IsActive,
            c.CreatedAt,
            StatesCount = c.States.Count
        });
        return Ok(ApiResponse<object>.Ok(response));
    }

    [HttpPost("countries")]
    public async Task<IActionResult> CreateCountry([FromBody] CreateCountryRequest request)
    {
        var country = Country.Create(request.Name, request.Code);
        await _countryRepo.AddAsync(country);
        await _countryRepo.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { country.Id, country.Name }, "País creado correctamente"));
    }

    [HttpPut("countries/{id}")]
    public async Task<IActionResult> UpdateCountry(int id, [FromBody] UpdateCountryRequest request)
    {
        var country = await _countryRepo.GetByIdAsync(id);
        if (country == null) return NotFound(ApiResponse<object>.Fail("País no encontrado"));
        
        country.ChangeInfo(request.Name, request.Code);
        await _countryRepo.UpdateAsync(country);
        await _countryRepo.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { country.Id, country.Name }, "País actualizado correctamente"));
    }

    [HttpPost("countries/{id}/toggle")]
    public async Task<IActionResult> ToggleCountry(int id)
    {
        var country = await _countryRepo.GetByIdAsync(id);
        if (country == null) return NotFound(ApiResponse<object>.Fail("País no encontrado"));
        
        if (country.IsActive)
            country.Deactivate();
        else
            country.Activate();
            
        await _countryRepo.UpdateAsync(country);
        await _countryRepo.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { country.Id, country.IsActive }, country.IsActive ? "País activado" : "País desactivado"));
    }

    [HttpGet("states")]
    public async Task<IActionResult> GetStates([FromQuery] int? countryId = null, [FromQuery] bool includeInactive = false)
    {
        var states = await _stateRepo.GetAllAsync(!includeInactive);
        if (countryId.HasValue)
            states = states.Where(s => s.CountryId == countryId.Value);
            
        var response = states.Select(s => new {
            s.Id,
            s.Name,
            s.Code,
            s.IsActive,
            s.CountryId,
            CountryName = s.Country?.Name,
            CitiesCount = s.Cities?.Count ?? 0
        });
        return Ok(ApiResponse<object>.Ok(response));
    }

    [HttpPost("states")]
    public async Task<IActionResult> CreateState([FromBody] CreateStateRequest request)
    {
        var state = State.Create(request.Name, request.Code, request.CountryId);
        await _stateRepo.AddAsync(state);
        await _stateRepo.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { state.Id, state.Name }, "Estado creado correctamente"));
    }

    [HttpPut("states/{id}")]
    public async Task<IActionResult> UpdateState(int id, [FromBody] UpdateStateRequest request)
    {
        var state = await _stateRepo.GetByIdAsync(id);
        if (state == null) return NotFound(ApiResponse<object>.Fail("Estado no encontrado"));
        
        state.ChangeInfo(request.Name, request.Code);
        if (request.CountryId.HasValue)
            state.ChangeCountry(request.CountryId.Value);
            
        await _stateRepo.UpdateAsync(state);
        await _stateRepo.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { state.Id, state.Name }, "Estado actualizado correctamente"));
    }

    [HttpPost("states/{id}/toggle")]
    public async Task<IActionResult> ToggleState(int id)
    {
        var state = await _stateRepo.GetByIdAsync(id);
        if (state == null) return NotFound(ApiResponse<object>.Fail("Estado no encontrado"));
        
        if (state.IsActive)
            state.Deactivate();
        else
            state.Activate();
            
        await _stateRepo.UpdateAsync(state);
        await _stateRepo.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { state.Id, state.IsActive }, state.IsActive ? "Estado activado" : "Estado desactivado"));
    }

    [HttpGet("cities")]
    public async Task<IActionResult> GetCities([FromQuery] int? stateId = null, [FromQuery] bool includeInactive = false)
    {
        var cities = await _cityRepo.GetAllAsync(!includeInactive);
        if (stateId.HasValue)
            cities = cities.Where(c => c.StateId == stateId.Value);
            
        var response = cities.Select(c => new {
            c.Id,
            c.Name,
            c.Code,
            c.IsActive,
            c.StateId,
            StateName = c.State?.Name,
            CountryName = c.State?.Country?.Name
        });
        return Ok(ApiResponse<object>.Ok(response));
    }

    [HttpPost("cities")]
    public async Task<IActionResult> CreateCity([FromBody] CreateCityRequest request)
    {
        var city = City.Create(request.Name, request.Code, request.StateId);
        await _cityRepo.AddAsync(city);
        await _cityRepo.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { city.Id, city.Name }, "Ciudad creada correctamente"));
    }

    [HttpPut("cities/{id}")]
    public async Task<IActionResult> UpdateCity(int id, [FromBody] UpdateCityRequest request)
    {
        var city = await _cityRepo.GetByIdAsync(id);
        if (city == null) return NotFound(ApiResponse<object>.Fail("Ciudad no encontrada"));
        
        city.ChangeInfo(request.Name, request.Code);
        if (request.StateId.HasValue)
            city.ChangeState(request.StateId.Value);
            
        await _cityRepo.UpdateAsync(city);
        await _cityRepo.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { city.Id, city.Name }, "Ciudad actualizada correctamente"));
    }

    [HttpPost("cities/{id}/toggle")]
    public async Task<IActionResult> ToggleCity(int id)
    {
        var city = await _cityRepo.GetByIdAsync(id);
        if (city == null) return NotFound(ApiResponse<object>.Fail("Ciudad no encontrada"));
        
        if (city.IsActive)
            city.Deactivate();
        else
            city.Activate();
            
        await _cityRepo.UpdateAsync(city);
        await _cityRepo.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { city.Id, city.IsActive }, city.IsActive ? "Ciudad activada" : "Ciudad desactivada"));
    }

    [HttpGet("event-types")]
    public async Task<IActionResult> GetEventTypes([FromQuery] bool includeInactive = false)
    {
        var types = await _eventTypeRepo.GetAllAsync(!includeInactive);
        var response = types.Select(t => new {
            t.Id,
            t.Name,
            t.Description,
            t.IsActive,
            EventsCount = t.Events?.Count ?? 0
        });
        return Ok(ApiResponse<object>.Ok(response));
    }

    [HttpPost("event-types")]
    public async Task<IActionResult> CreateEventType([FromBody] CreateEventTypeRequest request)
    {
        var eventType = EventType.Create(request.Name, request.Description);
        await _eventTypeRepo.AddAsync(eventType);
        await _eventTypeRepo.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { eventType.Id, eventType.Name }, "Tipo de evento creado correctamente"));
    }

    [HttpPut("event-types/{id}")]
    public async Task<IActionResult> UpdateEventType(int id, [FromBody] UpdateEventTypeRequest request)
    {
        var eventType = await _eventTypeRepo.GetByIdAsync(id);
        if (eventType == null) return NotFound(ApiResponse<object>.Fail("Tipo de evento no encontrado"));
        
        eventType.ChangeInfo(request.Name, request.Description);
        await _eventTypeRepo.UpdateAsync(eventType);
        await _eventTypeRepo.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { eventType.Id, eventType.Name }, "Tipo de evento actualizado correctamente"));
    }

    [HttpPost("event-types/{id}/toggle")]
    public async Task<IActionResult> ToggleEventType(int id)
    {
        var eventType = await _eventTypeRepo.GetByIdAsync(id);
        if (eventType == null) return NotFound(ApiResponse<object>.Fail("Tipo de evento no encontrado"));
        
        if (eventType.IsActive)
            eventType.Deactivate();
        else
            eventType.Activate();
            
        await _eventTypeRepo.UpdateAsync(eventType);
        await _eventTypeRepo.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { eventType.Id, eventType.IsActive }, eventType.IsActive ? "Tipo de evento activado" : "Tipo de evento desactivado"));
    }

    [HttpGet("event-categories")]
    public async Task<IActionResult> GetEventCategories([FromQuery] bool includeInactive = false)
    {
        var categories = await _eventCategoryRepo.GetAllAsync(!includeInactive);
        var response = categories.Select(c => new {
            c.Id,
            c.Name,
            c.Description,
            c.IsActive,
            EventsCount = c.Events?.Count ?? 0
        });
        return Ok(ApiResponse<object>.Ok(response));
    }

    [HttpPost("event-categories")]
    public async Task<IActionResult> CreateEventCategory([FromBody] CreateEventCategoryRequest request)
    {
        var category = EventCategory.Create(request.Name, request.Description);
        await _eventCategoryRepo.AddAsync(category);
        await _eventCategoryRepo.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { category.Id, category.Name }, "Categoría creada correctamente"));
    }

    [HttpPut("event-categories/{id}")]
    public async Task<IActionResult> UpdateEventCategory(int id, [FromBody] UpdateEventCategoryRequest request)
    {
        var category = await _eventCategoryRepo.GetByIdAsync(id);
        if (category == null) return NotFound(ApiResponse<object>.Fail("Categoría no encontrada"));
        
        category.ChangeInfo(request.Name, request.Description);
        await _eventCategoryRepo.UpdateAsync(category);
        await _eventCategoryRepo.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { category.Id, category.Name }, "Categoría actualizada correctamente"));
    }

    [HttpPost("event-categories/{id}/toggle")]
    public async Task<IActionResult> ToggleEventCategory(int id)
    {
        var category = await _eventCategoryRepo.GetByIdAsync(id);
        if (category == null) return NotFound(ApiResponse<object>.Fail("Categoría no encontrada"));
        
        if (category.IsActive)
            category.Deactivate();
        else
            category.Activate();
            
        await _eventCategoryRepo.UpdateAsync(category);
        await _eventCategoryRepo.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { category.Id, category.IsActive }, category.IsActive ? "Categoría activada" : "Categoría desactivada"));
    }
}

public record CreateCountryRequest(string Name, string? Code = null);
public record UpdateCountryRequest(string? Name, string? Code);
public record CreateStateRequest(string Name, string? Code, int CountryId);
public record UpdateStateRequest(string? Name, string? Code, int? CountryId = null);
public record CreateCityRequest(string Name, string? Code, int StateId);
public record UpdateCityRequest(string? Name, string? Code, int? StateId = null);
public record CreateEventTypeRequest(string Name, string? Description = null);
public record UpdateEventTypeRequest(string? Name, string? Description);
public record CreateEventCategoryRequest(string Name, string? Description = null);
public record UpdateEventCategoryRequest(string? Name, string? Description);
