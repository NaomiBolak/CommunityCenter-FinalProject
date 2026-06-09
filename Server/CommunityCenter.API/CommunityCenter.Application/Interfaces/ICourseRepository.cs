using CommunityCenter.Application.DTOs;
using CommunityCenter.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CommunityCenter.Application.Interfaces
{
    public interface ICourseRepository
    {
        Task<List<Course>> GetCoursesAsync();
        Task<Course> AddCourseAsync(Course course);
        Task<Course?> GetCourseByIdAsync(int id);
        Task<Course?> UpdateCourseAsync(int id, Course updated);
        Task<bool> DeleteCourseAsync(int id);
        Task<CourseRegistration> AddRegistrationAsync(CourseRegistration registration);
        Task<bool> CheckIfAlreadyRegisteredAsync(int userId, int courseId);
        Task<List<CourseRegistrantDto>> GetCourseRegistrantsAsync(int courseId);
    }
}
