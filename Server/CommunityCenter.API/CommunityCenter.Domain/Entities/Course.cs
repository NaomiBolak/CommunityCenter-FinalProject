using System;

namespace CommunityCenter.Domain.Entities
{
    public class Course
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public DayOfWeek DayOfWeek { get; set; }

        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        // 🖼️ הוספה חשובה
        public string ImagePath { get; set; } = string.Empty;

        public int CategoryId { get; set; }
        public int TargetAudienceId { get; set; }
        public int LocationId { get; set; }
        public int EmployeeId { get; set; }

        public virtual Category Category { get; set; }
        public virtual TargetAudience TargetAudience { get; set; }
        public virtual Location Location { get; set; }
        public virtual Employee Employee { get; set; }
    }
}