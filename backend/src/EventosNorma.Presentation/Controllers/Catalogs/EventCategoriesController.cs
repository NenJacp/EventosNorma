using EventosNorma.Application.Features.Catalogs.EventCategory.Commands;
using EventosNorma.Application.Features.Catalogs.EventCategory.Queries;
using EventosNorma.Application.Features.Catalogs.EventCategory.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace EventosNorma.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventCategoriesController : ControllerBase
{
    private readonly IMessageBus _bus;

    public EventCategoriesController(IMessageBus bus)
    {
        _bus = bus;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _bus.InvokeAsync<IEnumerable<EventCategoryViewModel>>(new GetEventCategoriesQuery());
        return Ok(items);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateEventCategoryCommand command)
    {
        var id = await _bus.InvokeAsync<int>(command);
        return Created($"/api/eventcategories/{id}", new { id });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateEventCategoryCommand command)
    {
        if (id != command.Id) return BadRequest();
        var success = await _bus.InvokeAsync<bool>(command);
        return success ? Ok() : NotFound();
    }
}
