using CommunityCenter.Domain.Entities;
using CommunityCenter.Infrastructure;

public static class DbSeeder
{
    public static void Seed(DataContext context)
    {
        if (!context.Subscribers.Any(u => u.Email == "admin@test.com"))
        {
            context.Subscribers.Add(new Subscriber
            {
                Email = "admin@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("1234"),
                Role = "Admin",
                FirstName = "Admin",
                IsActive = true,
                JoinDate = DateTime.Now
            });

            context.SaveChanges();
        }
    }
}