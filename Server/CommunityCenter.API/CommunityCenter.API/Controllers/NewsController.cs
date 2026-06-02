using CommunityCenter.Application.DTOs;
using CommunityCenter.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCenter.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly INewsService _newsService;

        public NewsController(INewsService newsService)
        {
            _newsService = newsService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewsDto>>> GetAll()
        {
            var news = await _newsService.GetAllNewsAsync();
            return Ok(news);
        }

        [HttpGet("latest")]
        public async Task<ActionResult<IEnumerable<NewsDto>>> GetLatest([FromQuery] int count = 3)
        {
            var news = (await _newsService.GetAllNewsAsync())
                .OrderByDescending(n => n.DatePublished)
                .Take(count);
            return Ok(news);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<NewsDto>> Create(NewsDto newsDto)
        {
            var created = await _newsService.CreateNewsAsync(newsDto);
            return Ok(created);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _newsService.DeleteNewsAsync(id);
            if (!deleted) return NotFound(new { message = "החדשה לא נמצאה" });
            return Ok(new { message = "החדשה נמחקה בהצלחה!" });
        }
    }
}