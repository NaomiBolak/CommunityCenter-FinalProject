using System;
using System.Collections.Generic;

namespace CommunityCenter.Domain.Entities
{
    public class Event
    {
        public int Id { get; set; }

        public string Description { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;

        public decimal UnitPrice { get; set; }

        public int MaxPlaces { get; set; }

        // ✔ חשוב להוספה
        public int CurrentRegistrations { get; set; } = 0;

        public DateTime Date { get; set; }

        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public int TargetAudienceId { get; set; }
        public int LocationId { get; set; }
        public int CategoryId { get; set; }
        public int EmployeeId { get; set; }

        public virtual TargetAudience TargetAudience { get; set; }
        public virtual Location Location { get; set; }
        public virtual Category Category { get; set; }
        public virtual Employee Employee { get; set; }

        public virtual ICollection<RegistrationEvent> Registrations { get; set; }
            = new List<RegistrationEvent>();
    }
}