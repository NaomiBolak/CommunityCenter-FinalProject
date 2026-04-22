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
        [HttpGet("locations")]
        public async Task<IActionResult> GetAllLocatin()
        {
            var locations = await _eventService.GettAllLocation();
            return Ok(locations); // מחזיר קוד 200 עם רשימת המיקומים 
        }
        [HttpGet("registers/count/{eventid}")]
        public async Task<IActionResult> GetRegister(int eventid)
        {
            int numofregister = await _eventService.HowManyRegistersToEvent( eventid);
            return Ok(numofregister); // מחזיר קוד 200 עם כמות הנרשמים  
        }





        [HttpGet("next/{amount}")]
        public async Task<IActionResult> GetNext(int amount)
        {
            var events = await _eventService.GetXNextEvents(amount);
            return Ok(events);
        }

        [HttpGet("location/{id}")]
        public async Task<IActionResult> GetlocationById(int id)
        {
            var location = await _eventService.GetLocation(id);
            return Ok(location);
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

        [HttpPost ("locations")]
        public async Task<IActionResult> Create([FromBody] Location newlocation)
        {
            if (newlocation == null)
            {
                return BadRequest("נתוני המיקום שרצית להוסיף ריקים");
            }

            var createdlocation = await _eventService.AddLocation(newlocation);

            return CreatedAtAction(nameof(GetAll), new { id = createdlocation.Id }, createdlocation);
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