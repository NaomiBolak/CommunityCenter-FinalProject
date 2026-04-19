namespace CommunityCenter.Application.DTOs.Auth
{
	public class RegisterDto
	{
		public string IdentityCard { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Phone { get; set; }
		public string Email { get; set; }
		public string Address { get; set; }
		public DateTime BirthDate { get; set; }
		
		public string Password { get; set; }
	}
}
