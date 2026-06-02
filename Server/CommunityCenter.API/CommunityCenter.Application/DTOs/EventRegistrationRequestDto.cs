namespace CommunityCenter.Application.DTOs
{
    public class EventRegistrationRequestDto
    {
        public int EventId { get; set; }
        public int Quantity { get; set; } = 1;
        public string CardNumber { get; set; } = string.Empty;
        public string CardHolder { get; set; } = string.Empty;
        public string ExpiryDate { get; set; } = string.Empty;
        public string Cvv { get; set; } = string.Empty;
    }
}
