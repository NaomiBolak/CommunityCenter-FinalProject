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
                .Include(u => u.CourseRegistrations)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return null;

            return new ProfileDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,

                Events = user.EventRegistrations,

                Courses = user.CourseRegistrations
            };
        }
    }
}