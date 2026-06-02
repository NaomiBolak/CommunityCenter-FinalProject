namespace CommunityCenter.Application.DTOs
{
    public class LookupItemDto
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class EmployeeLookupDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int CategoryId { get; set; }
    }
}
