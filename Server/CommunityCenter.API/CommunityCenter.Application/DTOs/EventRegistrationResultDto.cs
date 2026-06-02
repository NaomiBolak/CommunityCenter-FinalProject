namespace CommunityCenter.Application.DTOs
{
    public class EventRegistrationResultDto
    {
        public int RegistrationId { get; set; }
        public int EventId { get; set; }
        public string EventDescription { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public int PlacesCount { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime RegistrationDate { get; set; }
        public bool IsPaid { get; set; }
        public int RemainingPlaces { get; set; }
    }
}
