
using System;
using System.Reflection.Metadata;

 namespace CommunityCenter.Application.DTOs
{
   public class CourseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public int EmployeeId { get; set; }

        // ✨ 3 השדות החדשים שהוספנו כדי להתאים לטבלת ה-Course שלך:
        public DayOfWeek DayOfWeek { get; set; } // enum מובנה של ימי השבוע (0 = Sunday, 1 = Monday...)
        public TimeSpan StartTime { get; set; }  // פורמט זמן לשעת התחלה (למשל: "16:30:00")
        public TimeSpan EndTime { get; set; }    // פורמט זמן לשעת סיום (למשל: "18:00:00")
    }
    
}
