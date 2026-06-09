using CommunityCenter.Application.DTOs;
using CommunityCenter.Application.Interfaces;
using CommunityCenter.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CommunityCenter.Infrastructure.Repositories
{
    public class CourseRepository : ICourseRepository
    {
        private readonly DataContext _context;

        public CourseRepository(DataContext context)
        {
            _context = context;
        }

        // קבלת כל החוגים כולל קטגוריה ועובד (מומלץ בשביל התצוגה)
        public async Task<List<Course>> GetCoursesAsync()
        {
            return await _context.Courses
                .AsNoTracking()
                .ToListAsync();
        }

        // הוספת חוג חדש
        public async Task<Course> AddCourseAsync(Course course)
        {
            await _context.Courses.AddAsync(course);
            await _context.SaveChangesAsync();
            return course;
        }

        // שליפת חוג לפי ID (נצטרך את זה לבדיקת קיום חוג ב-Service)
        public async Task<Course?> GetCourseByIdAsync(int id)
        {
            return await _context.Courses.FindAsync(id);
        }

        // מחיקת חוג
        public async Task<bool> DeleteCourseAsync(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return false;

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }

        // שמירת הרשמה לחוג
        public async Task<CourseRegistration> AddRegistrationAsync(CourseRegistration registration)
        {
            await _context.CourseRegistrations.AddAsync(registration);
            await _context.SaveChangesAsync();
            return registration;
        }

        // בדיקה האם המשתמש כבר רשום לחוג הזה
        public async Task<bool> CheckIfAlreadyRegisteredAsync(int userId, int courseId)
        {
            return await _context.CourseRegistrations
                .AnyAsync(cr => cr.SubscriberId == userId && cr.CourseId == courseId);
        }

        // עדכון חוג קיים
        public async Task<Course?> UpdateCourseAsync(int id, Course updated)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return null;

            course.Name = updated.Name;
            course.Description = updated.Description;
            course.Price = updated.Price;
            course.ImagePath = updated.ImagePath;
            course.CategoryId = updated.CategoryId;
            course.EmployeeId = updated.EmployeeId;
            course.DayOfWeek = updated.DayOfWeek;
            course.StartTime = updated.StartTime;
            course.EndTime = updated.EndTime;

            await _context.SaveChangesAsync();
            return course;
        }

        // קבלת נרשמים לחוג
        public async Task<List<CourseRegistrantDto>> GetCourseRegistrantsAsync(int courseId)
        {
            return await _context.CourseRegistrations
                .Where(cr => cr.CourseId == courseId)
                .Include(cr => cr.Subscriber)
                .Select(cr => new CourseRegistrantDto
                {
                    Id = cr.Subscriber!.Id,
                    FirstName = cr.Subscriber.FirstName,
                    LastName = cr.Subscriber.LastName,
                    Email = cr.Subscriber.Email,
                    Phone = cr.Subscriber.Phone,
                })
                .ToListAsync();
        }
    }
}