using EventosNorma.Application.Common.Models;
using EventosNorma.Application.Features.Entities.Events.Queries;
using EventosNorma.Application.Features.Entities.Events.Commands;
using EventosNorma.Application.Features.Entities.Events.ViewModels;
using EventosNorma.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace EventosNorma.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IMessageBus _bus;

    public EventsController(IMessageBus bus)
    {
        _bus = bus;
    }

    [HttpGet]
    public async Task<IActionResult> GetPaged([FromQuery] GetEventsPagedQuery query)
    {
        var response = await _bus.InvokeAsync<PagedList<EventViewModel>>(query);
        return Ok(response);
    }

    [Authorize]
    [HttpGet("me/created")]
    public async Task<IActionResult> GetMyCreatedEvents([FromQuery] GetEventsPagedQuery query, [FromServices] ICurrentUserService userService)
    {
        var updatedQuery = query with { CreatedById = userService.UserId };
        var response = await _bus.InvokeAsync<PagedList<EventViewModel>>(updatedQuery);
        return Ok(response);
    }

    [Authorize]
    [HttpGet("me/joined")]
    public async Task<IActionResult> GetMyJoinedEvents([FromQuery] GetEventsPagedQuery query, [FromServices] ICurrentUserService userService)
    {
        var updatedQuery = query with { JoinedByUserId = userService.UserId };
        var response = await _bus.InvokeAsync<PagedList<EventViewModel>>(updatedQuery);
        return Ok(response);
    }

    [Authorize]
    [HttpGet("me/subscriptions")]
    public async Task<IActionResult> GetMySubscriptions([FromQuery] GetMySubscriptionsQuery query)
    {
        var response = await _bus.InvokeAsync<PagedList<SubscriptionViewModel>>(query);
        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateEventCommand command)
    {
        var eventId = await _bus.InvokeAsync<int>(command);
        return CreatedAtAction(nameof(GetPaged), new { id = eventId }, new { id = eventId });
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateEventCommand command)
    {
        if (id != command.Id) return BadRequest("El ID de la URL no coincide con el del cuerpo.");
        var success = await _bus.InvokeAsync<bool>(command);
        return success ? Ok(new { message = "Evento actualizado correctamente" }) : NotFound();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _bus.InvokeAsync<bool>(new UpdateEventCommand(id, null, null, null, null, null, null, null, null, null, null, null, false));
        return success ? Ok(new { message = "Evento desactivado correctamente" }) : NotFound();
    }
}
