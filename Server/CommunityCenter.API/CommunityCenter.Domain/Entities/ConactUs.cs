using System;

namespace CommunityCenter.Domain.Entities
{
    public class ContactRequest
    {
        public int Id { get; set; }

        public string SenderName { get; set; } = string.Empty;

        // ✔ הוספה חשובה
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public bool IsHandled { get; set; } = false;
    }
}