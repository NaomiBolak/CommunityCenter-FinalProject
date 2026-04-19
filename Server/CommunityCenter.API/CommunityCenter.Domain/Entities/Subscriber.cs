using System;
using System.Collections.Generic;

namespace CommunityCenter.Domain.Entities
{
    public class Subscriber
    {
        public int Id { get; set; }
        public string IdentityCard { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime JoinDate { get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = true;

        // עדכון שמות האוספים שיהיו תואמים למציאות
        public virtual ICollection<CourseRegistration> CourseRegistrations { get; set; } = new List<CourseRegistration>();
        public virtual ICollection<RegistrationEvent> EventRegistrations { get; set; } = new List<RegistrationEvent>(); 
    }
}