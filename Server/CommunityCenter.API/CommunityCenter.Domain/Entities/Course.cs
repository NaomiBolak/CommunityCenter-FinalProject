using System;
using System.Collections.Generic;

namespace CommunityCenter.Domain.Entities
{
    public class Course
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
       
       // מתי מתחיל
        //שעת התחלה
        public TimeSpan Time { get; set; }

        // FK
        public int CategoryId { get; set; }
        public int TargetAudienceId { get; set; }
        public int LocationId { get; set; }
        public int EmployeeId { get; set; }

        // Navigation properties
        public virtual Category Category { get; set; }
        public virtual TargetAudience TargetAudience { get; set; }
        public virtual Location Location { get; set; }
        public virtual Employee Employee { get; set; }
    }
}
