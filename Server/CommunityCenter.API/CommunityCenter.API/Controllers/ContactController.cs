using System.Collections.Generic;
using System.Threading.Tasks;
using CommunityCenter.Application.DTOs;
using CommunityCenter.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCenter.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        // POST /api/contact - שליחת הודעה
        [HttpPost]
        public async Task<IActionResult> SendMessage(ContactRequestDto dto)
        {
            await _contactService.SendMessageAsync(dto);
            return Ok(new { message = "ההודעה נשלחה בהצלחה!" });
        }

        // GET /api/contact - קבלת כל ההודעות (למנהל)
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactRequestDto>>> GetMessages()
        {
            var messages = await _contactService.GetMessagesAsync();
            return Ok(messages);
        }

        // PATCH /api/contact/{id} - סימון הודעה כטופלה (למנהל)
        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}")]
        public async Task<IActionResult> MarkAsHandled(int id)
        {
            await _contactService.MarkAsHandledAsync(id);
            return Ok(new { message = "הסטטוס עודכן בהצלחה!" });
        }
    }
}