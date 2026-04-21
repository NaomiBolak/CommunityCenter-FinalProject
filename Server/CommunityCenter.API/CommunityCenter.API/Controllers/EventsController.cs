using CommunityCenter.Application.Interfaces;
using CommunityCenter.Domain.Entities;
using CommunityCenter.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;


namespace CommunityCenter.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // הכתובת הבסיסית: api/events
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;

        //  כאן אנחנו מקבלים את הסרוויס כדי שנוכל להשתמש בו
        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var events = await _eventService.GetAllEvents();
            return Ok(events); // מחזיר קוד 200 עם רשימת האירועים
        }

        [HttpGet("next/{amount}")]
        public async Task<IActionResult> GetNext(int amount)
        {
            var events = await _eventService.GetXNextEvents(amount);
            return Ok(events);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _eventService.RemoveEvent(id);
            if (!success) return NotFound("האירוע לא נמצא");

            return Ok("האירוע נמחק בהצלחה");
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Event newEvent)
        {
            if (newEvent == null)
            {
                return BadRequest("נתוני האירוע ריקים");
            }

            var createdEvent = await _eventService.AddEvent(newEvent);

            return CreatedAtAction(nameof(GetAll), new { id = createdEvent.Id }, createdEvent);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Event ev)
        {
            if (id != ev.Id)
            {
                return BadRequest("ה-ID של הארוע המעודכן חייב להיות זהה לID שהכנסתם");
            }

            var updatedEvent = await _eventService.UpdateEvent(id, ev);

            if (updatedEvent == null)
            {
                return NotFound();
            }

            return Ok(updatedEvent);
        }
    }
}