using CommunityCenter.Application.DTOs;

namespace CommunityCenter.Application.Interfaces
{
    public interface INewsService
    {
        Task<IEnumerable<NewsDto>> GetAllNewsAsync();
        Task CreateNewsAsync(NewsDto newsDto);
    }
}