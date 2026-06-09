using CommunityCenter.Application.DTOs.Profile;
using CommunityCenter.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

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
                .Include(u => u.CourseRegistrations)
                    .ThenInclude(r => r.Course)
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
                }).ToList(),
                Courses = user.CourseRegistrations.Select(r => new CourseTicketDto
                {
                    RegistrationId = r.Id,
                    CourseId = r.CourseId,
                    CourseName = r.Course?.Name ?? string.Empty,
                    DayOfWeek = r.Course != null ? (int)r.Course.DayOfWeek : 0,
                    StartTime = r.Course != null ? r.Course.StartTime.ToString(@"hh\:mm") : string.Empty,
                    EndTime = r.Course != null ? r.Course.EndTime.ToString(@"hh\:mm") : string.Empty,
                    RegistrationDate = r.RegistrationDate
                }).ToList()
            };
        }
    }
}