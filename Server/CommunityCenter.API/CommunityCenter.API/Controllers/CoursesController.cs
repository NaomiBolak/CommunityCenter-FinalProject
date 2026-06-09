using CommunityCenter.Application.Interfaces;
using CommunityCenter.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using CommunityCenter.Application.DTOs;

namespace CommunityCenter.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CoursesController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        // 1. GET /api/courses - קבלת כל החוגים
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var courses = await _courseService.GetAllCoursesAsync();
            return Ok(courses);
        }

        // 2. POST /api/courses - הוספת חוג חדש (למשל למנהל מערכת)
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CourseDto courseDto)
        {
            if (courseDto == null) return BadRequest("נתוני החוג אינם תקינים.");

            var createdCourse = await _courseService.AddCourseAsync(courseDto);
            return CreatedAtAction(nameof(GetAll), new { id = createdCourse.Id }, createdCourse);
        }


        // 3. POST /api/courses/register - הרשמה של משתמש לחוג
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromQuery] int userId, [FromQuery] int courseId)
        {
            try
            {
                var registration = await _courseService.RegisterToCourseAsync(userId, courseId);
                return Ok(registration);
            }
            catch (Exception ex)
            {
                // אם המשתמש כבר רשום או שיש שגיאה, נחזיר שגיאה מסודרת לפרונטנד
                return BadRequest(new { message = ex.Message });
            }
        }


        // 4. DELETE /api/courses/:id - מחיקת חוג
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _courseService.DeleteCourseAsync(id);
            if (!success)
            {
                return NotFound($"לא נמצא חוג עם מזהה {id}");
            }

            return Ok(new { message = "החוג נמחק בהצלחה." });
        }

        // 5. PUT /api/courses/:id - עדכון חוג
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CourseDto courseDto)
        {
            if (courseDto == null) return BadRequest("נתוני החוג אינם תקינים.");
            var updated = await _courseService.UpdateCourseAsync(id, courseDto);
            if (updated == null) return NotFound($"לא נמצא חוג עם מזהה {id}");
            return Ok(updated);
        }

        // 6. GET /api/courses/:id/registrants - נרשמים לחוג
        [HttpGet("{id}/registrants")]
        public async Task<IActionResult> GetRegistrants(int id)
        {
            var registrants = await _courseService.GetCourseRegistrantsAsync(id);
            return Ok(registrants);
        }
    }
}