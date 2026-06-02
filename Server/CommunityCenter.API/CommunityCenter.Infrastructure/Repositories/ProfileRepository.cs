using CommunityCenter.Application.DTOs.Profile;
using CommunityCenter.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CommunityCenter.Infrastructure.Repositories
{
    public class ProfileRepository : IProfileRepository
    {
        private readonly DataContext _context;

        public ProfileRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<ProfileDto?> GetProfileAsync(int userId)
        {
            var user = await _context.Subscribers
                .Include(u => u.EventRegistrations)
                    .ThenInclude(r => r.Event)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return null;

            return new ProfileDto
            {
                Id = user.Id,
                IdentityCard = user.IdentityCard,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                BirthDate = user.BirthDate,
                JoinDate = user.JoinDate,
                Role = user.Role,
                Events = user.EventRegistrations.Select(r => new EventTicketDto
                {
                    RegistrationId = r.Id,
                    EventId = r.EventId,
                    EventDescription = r.Event?.Description ?? string.Empty,
                    EventDate = r.Event?.Date ?? r.RegistrationDate,
                    PlacesCount = r.PlacesCount,
                    TotalPrice = (r.Event?.UnitPrice ?? 0) * r.PlacesCount,
                    RegistrationDate = r.RegistrationDate,
                    IsPaid = r.IsPaid
                }).ToList()
            };
        }
    }
}