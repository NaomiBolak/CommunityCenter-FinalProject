using CommunityCenter.Application.DTOs;
using CommunityCenter.Application.Interfaces;
using CommunityCenter.Domain.Entities;

namespace CommunityCenter.Application.Services
{
    public class NewsService : INewsService
    {
        private readonly INewsRepository _newsRepository;

        public NewsService(INewsRepository newsRepository)
        {
            _newsRepository = newsRepository;
        }

        public async Task<IEnumerable<NewsDto>> GetAllNewsAsync()
        {
            var newsList = await _newsRepository.GetAllAsync();
            return newsList.Select(n => new NewsDto
            {
                Id = n.Id,
                Title = n.Title,
                Content = n.Content,
                DatePublished = n.DatePublished
            });
        }

        public async Task CreateNewsAsync(NewsDto newsDto)
        {
            var newsEntity = new News
            {
                Title = newsDto.Title,
                Content = newsDto.Content,
                DatePublished = DateTime.Now
            };
            await _newsRepository.AddAsync(newsEntity);
        }
    }
}