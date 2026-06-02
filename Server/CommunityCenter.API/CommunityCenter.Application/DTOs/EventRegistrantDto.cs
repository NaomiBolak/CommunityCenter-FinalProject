namespace CommunityCenter.Application.DTOs
{
    public class EventRegistrantDto
    {
        public int RegistrationId { get; set; }
        public int SubscriberId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int PlacesCount { get; set; }
        public DateTime RegistrationDate { get; set; }
        public bool IsPaid { get; set; }
    }
}
