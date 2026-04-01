using EventosNorma.Application.Features.Catalogs.EventType.Commands;
using EventosNorma.Application.Features.Catalogs.EventType.Queries;
using EventosNorma.Application.Features.Catalogs.EventType.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace EventosNorma.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventTypesController : ControllerBase
{
    private readonly IMessageBus _bus;

    public EventTypesController(IMessageBus bus)
    {
        _bus = bus;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _bus.InvokeAsync<IEnumerable<EventTypeViewModel>>(new GetEventTypesQuery());
        return Ok(items);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateEventTypeCommand command)
    {
        var id = await _bus.InvokeAsync<int>(command);
        return Created($"/api/eventtypes/{id}", new { id });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateEventTypeCommand command)
    {
        if (id != command.Id) return BadRequest();
        var success = await _bus.InvokeAsync<bool>(command);
        return success ? Ok() : NotFound();
    }
}
