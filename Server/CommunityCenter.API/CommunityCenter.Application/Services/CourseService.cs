using CommunityCenter.Application.Interfaces;
using CommunityCenter.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CommunityCenter.Application.DTOs;


namespace CommunityCenter.Application.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepository;

        // הזרקת ה-Repository דרך ה-Constructor
        public CourseService(ICourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        // לקבלת כל החוגים
        public async Task<List<Course>> GetAllCoursesAsync()
        {
            return await _courseRepository.GetCoursesAsync();
        }

        // להוספת חוג חדש
        //public async Task<Course> AddCourseAsync(Course course)
        //{
        //    // כאן אפשר להוסיף לוגיקה אם חסרים ערכי ברירת מחדל (בדומה למה שעשית ב-EventRepository)
        //    if (course.CategoryId == 0) course.CategoryId = 1;
        //    if (course.EmployeeId == 0) course.EmployeeId = 1;

        //    return await _courseRepository.AddCourseAsync(course);
        //}

        //public async Task<Course> AddCourseAsync(CourseDto courseDto)
        //{
        //    // ממירים את ה-DTO לישות ה-Entity האמיתית של בסיס הנתונים
        //    var course = new Course
        //    {
        //        Name = courseDto.Name,
        //        Description = courseDto.Description,
        //        Price = courseDto.Price,
        //        CategoryId = courseDto.CategoryId == 0 ? 1 : courseDto.CategoryId,
        //        EmployeeId = courseDto.EmployeeId == 0 ? 1 : courseDto.EmployeeId,
        //        ImagePath = courseDto.ImagePath

        //        // אובייקטי הניווט (Navigation Properties) יישארו null וה-DB יקשר אותם אוטומטית לפי ה-Id!
        //    };

        //    return await _courseRepository.AddCourseAsync(course);
        //}

        public async Task<Course> AddCourseAsync(CourseDto courseDto)
        {
            var categoryId = courseDto.CategoryId > 0 ? courseDto.CategoryId : 1;
            var employeeId = courseDto.EmployeeId > 0 ? courseDto.EmployeeId : 1;

            var entity = new Course
            {
                Name = courseDto.Name,
                Description = courseDto.Description,
                Price = courseDto.Price,
                ImagePath = !string.IsNullOrWhiteSpace(courseDto.ImagePath) ? courseDto.ImagePath : "images/default-course.png",
                CategoryId = categoryId,
                EmployeeId = employeeId,
                LocationId = 1,
                TargetAudienceId = 1,

                // שליפת הנתונים מה-DTO
                DayOfWeek = courseDto.DayOfWeek,
                StartTime = courseDto.StartTime,
                EndTime = courseDto.EndTime
            };

            return await _courseRepository.AddCourseAsync(entity);
        }


        // למחיקת חוג
        public async Task<bool> DeleteCourseAsync(int id)
        {
            return await _courseRepository.DeleteCourseAsync(id);
        }

        // עדכון חוג
        public async Task<Course?> UpdateCourseAsync(int id, CourseDto courseDto)
        {
            var updated = new Course
            {
                Name = courseDto.Name,
                Description = courseDto.Description,
                Price = courseDto.Price,
                ImagePath = !string.IsNullOrWhiteSpace(courseDto.ImagePath) ? courseDto.ImagePath : "images/default-course.png",
                CategoryId = courseDto.CategoryId > 0 ? courseDto.CategoryId : 1,
                EmployeeId = courseDto.EmployeeId > 0 ? courseDto.EmployeeId : 1,
                DayOfWeek = courseDto.DayOfWeek,
                StartTime = courseDto.StartTime,
                EndTime = courseDto.EndTime
            };
            return await _courseRepository.UpdateCourseAsync(id, updated);
        }

        // נרשמים לחוג
        public async Task<List<CourseRegistrantDto>> GetCourseRegistrantsAsync(int courseId)
        {
            return await _courseRepository.GetCourseRegistrantsAsync(courseId);
        }

        // הרשמה לחוג עם הלוגיקה העסקית המבוקשת באפיון
        public async Task<CourseRegistration> RegisterToCourseAsync(int userId, int courseId)
        {
            // 1. בדיקת קיום החוג
            var course = await _courseRepository.GetCourseByIdAsync(courseId);
            if (course == null)
            {
                throw new Exception("החוג המבוקש אינו קיים במערכת.");
            }

            // 2. בדיקה שהמשתמש לא רשום כבר (מניעת הרשמה כפולה)
            bool isAlreadyRegistered = await _courseRepository.CheckIfAlreadyRegisteredAsync(userId, courseId);
            if (isAlreadyRegistered)
            {
                throw new Exception("המשתמש כבר רשום לחוג זה.");
            }

            // 3. יצירת ישות ההרשמה (בלי IsPaid) ושמירה
            var registration = new CourseRegistration
            {
                SubscriberId = userId,
                CourseId = courseId,
                RegistrationDate = DateTime.Now
            };

            return await _courseRepository.AddRegistrationAsync(registration);
        }
    }
}
