using CommunityCenter.Domain.Entities;
using CommunityCenter.Application.Interfaces;

namespace CommunityCenter.Application.Interfaces
{
    public interface INewsRepository
    {
        Task<IEnumerable<News>> GetAllAsync();
        Task AddAsync(News news);
        Task<bool> DeleteAsync(int id);
    }
}