using CommunityCenter.Domain.Entities;

namespace CommunityCenter.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<Subscriber?> GetByEmailAsync(string email);
        Task AddAsync(Subscriber user);
    }
}