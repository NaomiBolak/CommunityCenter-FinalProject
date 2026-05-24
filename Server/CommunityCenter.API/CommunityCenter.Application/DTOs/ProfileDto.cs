namespace CommunityCenter.Application.DTOs.Profile
{
    public class ProfileDto
    {
        public int Id { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public object? Events { get; set; }

        public object? Courses { get; set; }
    }
}