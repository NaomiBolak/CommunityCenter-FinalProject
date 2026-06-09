using CommunityCenter.Application.DTOs;
using CommunityCenter.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CommunityCenter.Application.Interfaces
{
    public interface ICourseService
    {
        Task<List<Course>> GetAllCoursesAsync();
        Task<Course> AddCourseAsync(CourseDto courseDto);
        Task<Course?> UpdateCourseAsync(int id, CourseDto courseDto);
        Task<bool> DeleteCourseAsync(int id);
        Task<List<CourseRegistrantDto>> GetCourseRegistrantsAsync(int courseId);
        Task<CourseRegistration> RegisterToCourseAsync(int userId, int courseId);
    }
}
