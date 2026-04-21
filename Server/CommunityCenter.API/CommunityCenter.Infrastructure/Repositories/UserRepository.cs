using CommunityCenter.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using CommunityCenter.Application.Interfaces;

namespace CommunityCenter.Infrastructure.Repositories
{
    public class UserRepository: IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Subscriber?> GetByEmailAsync(string email)
        {
            return await _context.Subscribers
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task AddAsync(Subscriber user)
        {
            _context.Subscribers.Add(user);
            await _context.SaveChangesAsync();
        }
    }
}