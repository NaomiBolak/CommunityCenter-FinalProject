using System;

namespace CommunityCenter.Domain.Entities
{
    public class News
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        // 🖼️ הוספה חשובה
        public string ImagePath { get; set; } = string.Empty;

        public DateTime DatePublished { get; set; } = DateTime.Now;

        // אופציונלי – מי פרסם
        public int? EmployeeId { get; set; }
        public virtual Employee? Employee { get; set; }
    }
}