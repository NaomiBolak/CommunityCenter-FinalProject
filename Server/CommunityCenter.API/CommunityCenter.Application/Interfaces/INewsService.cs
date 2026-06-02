using CommunityCenter.Application.DTOs;

namespace CommunityCenter.Application.Interfaces
{
    public interface INewsService
    {
        Task<IEnumerable<NewsDto>> GetAllNewsAsync();
        Task<NewsDto> CreateNewsAsync(NewsDto newsDto);
        Task<bool> DeleteNewsAsync(int id);
    }
}