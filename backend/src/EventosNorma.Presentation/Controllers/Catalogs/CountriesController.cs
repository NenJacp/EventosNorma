using EventosNorma.Application.Common.Models;
using EventosNorma.Application.Features.Catalogs.Country.Commands;
using EventosNorma.Application.Features.Catalogs.Country.Queries;
using EventosNorma.Application.Features.Catalogs.Country.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace EventosNorma.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CountriesController : ControllerBase
{
    private readonly IMessageBus _bus;

    public CountriesController(IMessageBus bus)
    {
        _bus = bus;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _bus.InvokeAsync<IEnumerable<CountryViewModel>>(new GetCountriesQuery());
        return Ok(ApiResponse<IEnumerable<CountryViewModel>>.Ok(items));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateCountryCommand command)
    {
        var id = await _bus.InvokeAsync<int>(command);
        return Created($"/api/countries/{id}", ApiResponse<object>.Ok(new { id }));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateCountryCommand command)
    {
        if (id != command.Id) return BadRequest();
        var success = await _bus.InvokeAsync<bool>(command);
        return success ? Ok(ApiResponse<object>.Ok(null, "País actualizado")) : NotFound();
    }
}
