using System.Collections.Generic;

namespace CommunityCenter.Domain.Entities
{
    public class Employee
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // תפקיד - נוסף לפי האפיון
        public string Description { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;

        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }

        public virtual ICollection<Event> Events { get; set; } = new List<Event>();
    }
}