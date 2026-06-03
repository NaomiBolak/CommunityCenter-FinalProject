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
                JoinDate = DateTime.UtcNow,
                BirthDate = DateTime.UtcNow,
                LastName = "",
                Phone = "",
                Address = "",
                IdentityCard = "000000000"
            });
            context.SaveChanges();
        }

        if (!context.Categories.Any())
        {
            context.Categories.AddRange(
                new Category { Description = "ספורט" },
                new Category { Description = "תרבות" },
                new Category { Description = "חינוך" },
                new Category { Description = "קהילה" }
            );
            context.SaveChanges();
        }

        if (!context.Locations.Any())
        {
            context.Locations.AddRange(
                new Location { Description = "אולם ראשי — קהילות יעקב 10" },
                new Location { Description = "חצר פעילות" },
                new Location { Description = "לובי" }
            );
            context.SaveChanges();
        }

        if (!context.TargetAudiences.Any())
        {
            context.TargetAudiences.AddRange(
                new TargetAudience { Description = "משפחות" },
                new TargetAudience { Description = "ילדים" },
                new TargetAudience { Description = "מבוגרים" },
                new TargetAudience { Description = "כל הגילאים" }
            );
            context.SaveChanges();
        }

        if (!context.Employees.Any())
        {
            context.Employees.Add(new Employee
            {
                FirstName = "צוות",
                LastName = "מינהל קהילתי",
                Role = "רכז/ת",
                Description = "מינהל קהילתי רמת שלמה",
                Phone = "02-0000000",
                CategoryId = 1
            });
            context.SaveChanges();
        }
    }
}