using System;

namespace CommunityCenter.Domain.Entities
{
    public class CourseRegistration
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public int SubscriberId { get; set; }
        public DateTime RegistrationDate { get; set; } = DateTime.Now;

        // הוספת הקישורים הנדרשים ל-EF
        public virtual Course Course { get; set; }
        public virtual Subscriber Subscriber { get; set; }
    }
}