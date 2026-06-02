using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommunityCenter.Application.DTOs
{
    public class ContactRequestDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsHandled { get; set; }
        public string Status => IsHandled ? "resolved" : "pending";
    }
}
