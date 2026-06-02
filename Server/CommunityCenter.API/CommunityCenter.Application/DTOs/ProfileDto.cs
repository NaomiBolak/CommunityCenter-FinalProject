namespace CommunityCenter.Application.DTOs.Profile
{
    public class ProfileDto
    {
        public int Id { get; set; }
        public string IdentityCard { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
        public DateTime JoinDate { get; set; }
        public string Role { get; set; } = string.Empty;
        public List<EventTicketDto> Events { get; set; } = new();
    }
}