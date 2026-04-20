using System;

namespace CommunityCenter.Domain.Entities
{
    public class RegistrationEvent
    {
        public int Id { get; set; }

        public int EventId { get; set; }
        public int SubscriberId { get; set; }

        // ✔ כמה כרטיסים
        public int PlacesCount { get; set; } = 1;

        public DateTime RegistrationDate { get; set; } = DateTime.Now;

        public bool IsPaid { get; set; }

        public virtual Event Event { get; set; }
        public virtual Subscriber Subscriber { get; set; }
    }
}