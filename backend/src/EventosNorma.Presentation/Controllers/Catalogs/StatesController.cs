using EventosNorma.Application.Features.Catalogs.State.Commands;
using EventosNorma.Application.Features.Catalogs.State.Queries;
using EventosNorma.Application.Features.Catalogs.State.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace EventosNorma.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatesController : ControllerBase
{
    private readonly IMessageBus _bus;

    public StatesController(IMessageBus bus)
    {
        _bus = bus;
    }

    [HttpGet("country/{countryId}")]
    public async Task<IActionResult> GetByCountry(int countryId)
    {
        var items = await _bus.InvokeAsync<IEnumerable<StateViewModel>>(new GetStatesByCountryQuery(countryId));
        return Ok(items);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateStateCommand command)
    {
        var id = await _bus.InvokeAsync<int>(command);
        return Created($"/api/states/{id}", new { id });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateStateCommand command)
    {
        if (id != command.Id) return BadRequest();
        var success = await _bus.InvokeAsync<bool>(command);
        return success ? Ok() : NotFound();
    }
}
