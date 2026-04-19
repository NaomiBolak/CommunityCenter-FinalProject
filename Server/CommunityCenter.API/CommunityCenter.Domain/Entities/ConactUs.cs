namespace CommunityCenter.Domain.Entities
{ 
public class ContactRequest

{
    public int Id { get; set; }
    public string SenderName { get; set; } // שם הפונה 
    public string Message { get; set; } // תוכן הפנייה
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public bool IsHandled { get; set; } = false; // סימון פניות שגמרנו לטפל בהן
}
    }