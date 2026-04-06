using EventosNorma.Application.Common.Models;
using EventosNorma.Application.Features.Catalogs.City.Commands;
using EventosNorma.Application.Features.Catalogs.City.Queries;
using EventosNorma.Application.Features.Catalogs.City.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace EventosNorma.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CitiesController : ControllerBase
{
    private readonly IMessageBus _bus;

    public CitiesController(IMessageBus bus)
    {
        _bus = bus;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _bus.InvokeAsync<IEnumerable<CityViewModel>>(new GetCitiesQuery());
        return Ok(ApiResponse<IEnumerable<CityViewModel>>.Ok(items));
    }

    [HttpGet("state/{stateId}")]
    public async Task<IActionResult> GetByState(int stateId)
    {
        var items = await _bus.InvokeAsync<IEnumerable<CityViewModel>>(new GetCitiesByStateQuery(stateId));
        return Ok(ApiResponse<IEnumerable<CityViewModel>>.Ok(items));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateCityCommand command)
    {
        var id = await _bus.InvokeAsync<int>(command);
        return Created($"/api/cities/{id}", ApiResponse<object>.Ok(new { id }));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateCityCommand command)
    {
        if (id != command.Id) return BadRequest();
        var success = await _bus.InvokeAsync<bool>(command);
        return success ? Ok(ApiResponse<object>.Ok(null, "Ciudad actualizada")) : NotFound();
    }
}
