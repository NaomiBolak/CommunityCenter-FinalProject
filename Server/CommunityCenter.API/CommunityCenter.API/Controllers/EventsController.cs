using CommunityCenter.Application.DTOs;
using CommunityCenter.Application.Interfaces;
using CommunityCenter.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCenter.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var events = await _eventService.GetAllEvents();
            return Ok(events);
        }

        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcoming([FromQuery] int count = 3)
        {
            var events = await _eventService.GetXNextEvents(count);
            return Ok(events);
        }

        [HttpGet("next/{amount}")]
        public async Task<IActionResult> GetNext(int amount)
        {
            var events = await _eventService.GetXNextEvents(amount);
            return Ok(events);
        }

        [HttpGet("locations")]
        public async Task<IActionResult> GetAllLocatin()
        {
            var locations = await _eventService.GettAllLocation();
            return Ok(locations.Select(l => new LookupItemDto { Id = l.Id, Description = l.Description ?? string.Empty }));
        }

        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees()
        {
            var employees = await _eventService.GetEmployees();
            return Ok(employees.Select(e => new EmployeeLookupDto
            {
                Id = e.Id,
                FirstName = e.FirstName ?? string.Empty,
                LastName = e.LastName ?? string.Empty,
                Role = e.Role ?? string.Empty,
                Description = e.Description ?? string.Empty,
                Phone = e.Phone ?? string.Empty,
                CategoryId = e.CategoryId
            }));
        }

        [HttpGet("categories")]
        public async Task<IActionResult> getcategories()
        {
            var categories = await _eventService.GetCategories();
            return Ok(categories.Select(c => new LookupItemDto { Id = c.Id, Description = c.Description ?? string.Empty }));
        }

        [HttpGet("targetAudience")]
        public async Task<IActionResult> gettargetAudiences()
        {
            var targetAudience = await _eventService.GetTargetAudiences();
            return Ok(targetAudience.Select(t => new LookupItemDto { Id = t.Id, Description = t.Description ?? string.Empty }));
        }

        [HttpGet("registers/count/{eventid}")]
        public async Task<IActionResult> GetRegister(int eventid)
        {
            int numofregister = await _eventService.HowManyRegistersToEvent(eventid);
            return Ok(numofregister);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{eventId}/registrants")]
        public async Task<IActionResult> GetRegistrants(int eventId)
        {
            var registrants = await _eventService.GetEventRegistrantsAsync(eventId);
            return Ok(registrants);
        }

        [HttpGet("location/{id}")]
        public async Task<IActionResult> GetlocationById(int id)
        {
            var location = await _eventService.GetLocation(id);
            return Ok(location);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ev = await _eventService.GetEventById(id);
            if (ev == null) return NotFound();
            return Ok(ev);
        }

        [Authorize]
        [HttpPost("register")]
        public async Task<IActionResult> RegisterToEvent([FromBody] EventRegistrationRequestDto dto)
        {
            var userId = int.Parse(User.FindFirst("UserId")!.Value);
            var result = await _eventService.RegisterToEventAsync(userId, dto);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _eventService.RemoveEvent(id);
            if (!success) return NotFound("האירוע לא נמצא");
            return Ok("האירוע נמחק בהצלחה");
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Event newEvent)
        {
            if (newEvent == null) return BadRequest("נתוני האירוע ריקים");
            var createdEvent = await _eventService.AddEvent(newEvent);
            return CreatedAtAction(nameof(GetAll), new { id = createdEvent.Id }, createdEvent);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("locations")]
        public async Task<IActionResult> CreateLocation([FromBody] Location newlocation)
        {
            if (newlocation == null) return BadRequest("נתוני המיקום שרצית להוסיף ריקים");
            var createdlocation = await _eventService.AddLocation(newlocation);
            return CreatedAtAction(nameof(GetAll), new { id = createdlocation.Id }, createdlocation);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("employee")]
        public async Task<IActionResult> AddEmployee([FromBody] Employee newemp)
        {
            if (newemp == null) return BadRequest("נתוני העובד שרצית להוסיף ריקים");
            var createdemp = await _eventService.AddEmployee(newemp);
            return CreatedAtAction(nameof(GetAll), new { id = createdemp.Id }, createdemp);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("category")]
        public async Task<IActionResult> AddCategory([FromBody] Category newcat)
        {
            if (newcat == null) return BadRequest("נתוני הקטגוריה שרצית להוסיף ריקים");
            var createdcat = await _eventService.AddCategory(newcat);
            return CreatedAtAction(nameof(GetAll), new { id = createdcat.Id }, createdcat);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("TargetAudience")]
        public async Task<IActionResult> AddTargetAudience([FromBody] TargetAudience newtar)
        {
            if (newtar == null) return BadRequest("נתוני הקהל יעד שרצית להוסיף ריקים");
            var createdtar = await _eventService.AddtargetAudience(newtar);
            return CreatedAtAction(nameof(GetAll), new { id = createdtar.Id }, createdtar);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Event ev)
        {
            if (id != ev.Id) return BadRequest("ה-ID של הארוע המעודכן חייב להיות זהה ל-ID שהכנסתם");
            var updatedEvent = await _eventService.UpdateEvent(id, ev);
            if (updatedEvent == null) return NotFound();
            return Ok(updatedEvent);
        }
    }
}