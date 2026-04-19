namespace CommunityCenter.Domain.Entities
{
    public class News
    {
        public int Id { get; set; }
        public string Title { get; set; } // כותרת המבזק [cite: 19]
        public string Content { get; set; } // תוכן הכתבה [cite: 31]
        public DateTime DatePublished { get; set; } = DateTime.Now;
    }
}