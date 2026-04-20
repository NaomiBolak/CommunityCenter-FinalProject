using CommunityCenter.Domain.Entities;

public interface IUserRepository
{
    Task<Subscriber?> GetByEmailAsync(string email);
    Task<Subscriber?> GetByIdentityCardAsync(string identityCard);
    Task AddAsync(Subscriber user);
}