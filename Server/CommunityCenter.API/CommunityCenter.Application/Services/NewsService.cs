using CommunityCenter.Application.DTOs;
using CommunityCenter.Application.Interfaces;
using CommunityCenter.Domain.Entities;

namespace CommunityCenter.Application.Services
{
    public class NewsService : INewsService
    {
        private readonly INewsRepository _newsRepository;
        private readonly ILoggerService _logger;

        public NewsService(INewsRepository newsRepository,ILoggerService logger)
        {
            _newsRepository = newsRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<NewsDto>> GetAllNewsAsync()
        {
            var newsList = await _newsRepository.GetAllAsync();
           
            return newsList.Select(n => new NewsDto
            {
                Id = n.Id,
                Title = n.Title,
                Content = n.Content,
                ImagePath = n.ImagePath,
                DatePublished = n.DatePublished
            });
        }

        public async Task<NewsDto> CreateNewsAsync(NewsDto newsDto)
        {
            var newsEntity = new News
            {
                Title = newsDto.Title,
                Content = newsDto.Content,
                ImagePath = newsDto.ImagePath ?? string.Empty,
                DatePublished = DateTime.Now
            };
            await _newsRepository.AddAsync(newsEntity);
            await _logger.Info($"חדשות חדשות נוצרו: {newsDto.Title}");

            return new NewsDto
            {
                Id = newsEntity.Id,
                Title = newsEntity.Title,
                Content = newsEntity.Content,
                ImagePath = newsEntity.ImagePath,
                DatePublished = newsEntity.DatePublished
            };
        }

        public async Task<bool> DeleteNewsAsync(int id)
        {
            var deleted = await _newsRepository.DeleteAsync(id);
            if (deleted)
            {
                await _logger.Info($"חדשות נמחקו: ID {id}");
            }
            return deleted;
        }
    }
}