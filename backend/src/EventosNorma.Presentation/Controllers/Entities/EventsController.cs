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
        return Ok(ApiResponse<PagedList<EventViewModel>>.Ok(response));
    }

    [Authorize]
    [HttpGet("me/created")]
    public async Task<IActionResult> GetMyCreatedEvents([FromQuery] GetEventsPagedQuery query, [FromServices] ICurrentUserService userService)
    {
        var updatedQuery = query with { CreatedById = userService.UserId };
        var response = await _bus.InvokeAsync<PagedList<EventViewModel>>(updatedQuery);
        return Ok(ApiResponse<PagedList<EventViewModel>>.Ok(response));
    }

    [Authorize]
    [HttpGet("me/joined")]
    public async Task<IActionResult> GetMyJoinedEvents([FromQuery] GetEventsPagedQuery query, [FromServices] ICurrentUserService userService)
    {
        var updatedQuery = query with { JoinedByUserId = userService.UserId };
        var response = await _bus.InvokeAsync<PagedList<EventViewModel>>(updatedQuery);
        return Ok(ApiResponse<PagedList<EventViewModel>>.Ok(response));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateEventCommand command)
    {
        var eventId = await _bus.InvokeAsync<int>(command);
        return CreatedAtAction(nameof(GetPaged), new { id = eventId }, ApiResponse<object>.Ok(new { id = eventId }));
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateEventCommand command)
    {
        if (id != command.Id) return BadRequest();
        var success = await _bus.InvokeAsync<bool>(command);
        return success ? Ok(ApiResponse<object>.Ok(null, "Evento actualizado correctamente")) : NotFound();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _bus.InvokeAsync<bool>(new UpdateEventCommand(id, null, null, null, null, null, null, null, null, null, null, null, false));
        return success ? Ok(ApiResponse<object>.Ok(null, "Evento desactivado correctamente")) : NotFound();
    }

    [Authorize]
    [HttpPost("{id}/join")]
    public async Task<IActionResult> Join(int id)
    {
        var success = await _bus.InvokeAsync<bool>(new JoinEventCommand(id));
        return success ? Ok(ApiResponse<object>.Ok(null, "Te has unido al evento correctamente")) : BadRequest();
    }

    [Authorize]
    [HttpPost("{id}/comments")]
    public async Task<IActionResult> AddComment(int id, [FromBody] AddCommentCommand command)
    {
        if (id != command.EventId) return BadRequest();
        var commentId = await _bus.InvokeAsync<int>(command);
        return Ok(ApiResponse<object>.Ok(new { id = commentId }));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var response = await _bus.InvokeAsync<EventViewModel>(new GetEventByIdQuery(id));
        return Ok(ApiResponse<EventViewModel>.Ok(response));
    }

    [Authorize]
    [HttpGet("{id}/comments")]
    public async Task<IActionResult> GetComments(int id)
    {
        var response = await _bus.InvokeAsync<IEnumerable<CommentViewModel>>(new GetEventCommentsQuery(id));
        return Ok(ApiResponse<IEnumerable<CommentViewModel>>.Ok(response));
    }

    [Authorize]
    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var success = await _bus.InvokeAsync<bool>(new CancelEventCommand(id));
        return success ? Ok(ApiResponse<object>.Ok(null, "Evento cancelado correctamente")) : BadRequest();
    }

    [Authorize]
    [HttpPost("{id}/image")]
    public async Task<IActionResult> UpdateImage(int id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(ApiResponse<object>.Fail("No se proporcionó un archivo válido."));

        using var stream = file.OpenReadStream();
        var command = new UpdateEventImageCommand(id, stream, file.FileName);
        var imageUrl = await _bus.InvokeAsync<string>(command);

        return Ok(ApiResponse<object>.Ok(new { imageUrl }, "Imagen del evento actualizada correctamente."));
    }
}
