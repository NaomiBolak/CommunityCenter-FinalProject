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
        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees()
        {

            var employees = await _eventService.GetEmployees();
            return Ok(employees); // מחזיר קוד 200 עם רשימת העובדים 
        }
        [HttpGet("categories")]
        public async Task<IActionResult> getcategories()
        {

            var categories = await _eventService.GetCategories();
            return Ok(categories); // מחזיר קוד 200 עם רשימת קטגוריות 
        }
        [HttpGet("targetAudience")]
        public async Task<IActionResult> gettargetAudiences()
        {

            var targetAudience = await _eventService.GetTargetAudiences();
            return Ok(targetAudience); // מחזיר קוד 200 עם רשימת קהלי יעד 
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
        [HttpDelete("/category/{id}")]
        public async Task<IActionResult> RemoveCategory(int id)
        {
            var success = await _eventService.RemoveCategory(id);
            if (!success) return NotFound("הקטגוריה לא נמצא");

            return Ok("הקטגוריה נמחק בהצלחה");
        }

        [HttpDelete("/employee/{id}")]
        public async Task<IActionResult> RemoveEmployee(int id)
        {
            var success = await _eventService.RemoveEmployee(id);
            if (!success) return NotFound("העובד לא נמצא");

            return Ok("העובד נמחק בהצלחה");
        }
        [HttpDelete("/targetaudience/{id}")]
        public async Task<IActionResult> RemoveTargetAudience(int id)
        {
            var success = await _eventService.RemoveTargetAudience(id);
            if (!success) return NotFound(" קהל יעד לא נמצא");

            return Ok("קהל יעד נמחק בהצלחה");
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
        [HttpPost("employee")]
        public async Task<IActionResult> AddEmployee([FromBody] Employee newemp)
        {
            if (newemp == null)
            {
                return BadRequest("נתוני העובד שרצית להוסיף ריקים");
            }

            var createdemp = await _eventService.AddEmployee(newemp);

            return CreatedAtAction(nameof(GetAll), new { id = createdemp.Id }, createdemp);
        }
        [HttpPost("category")]
        public async Task<IActionResult> AddCategory([FromBody] Category newcat)
        {
            if (newcat == null)
            {
                return BadRequest("נתוני הקטגוריה שרצית להוסיף ריקים");
            }

            var createdcat = await _eventService.AddCategory(newcat);

            return CreatedAtAction(nameof(GetAll), new { id = createdcat.Id }, createdcat);
        }
        [HttpPost("TargetAudience")]
        public async Task<IActionResult> AddTargetAudience([FromBody] TargetAudience newtar)
        {
            if (newtar == null)
            {
                return BadRequest("נתוני הקהל יעד שרצית להוסיף ריקים");
            }

            var createdtar = await _eventService.AddtargetAudience(newtar);

            return CreatedAtAction(nameof(GetAll), new { id = createdtar.Id }, createdtar);
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