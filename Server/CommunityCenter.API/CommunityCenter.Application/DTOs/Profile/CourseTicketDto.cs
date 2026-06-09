namespace CommunityCenter.Application.DTOs.Profile
{
    public class CourseTicketDto
    {
        public int RegistrationId { get; set; }
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public int DayOfWeek { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; }
    }
}
