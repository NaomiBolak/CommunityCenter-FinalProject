using CommunityCenter.Application.DTOs;
using CommunityCenter.Application.Interfaces;
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

        [HttpPost]
        public async Task<ActionResult> Create(NewsDto newsDto)
        {
            await _newsService.CreateNewsAsync(newsDto);
            return Ok(new { message = "החדשה נוצרה בהצלחה!" });
        }
    }
}