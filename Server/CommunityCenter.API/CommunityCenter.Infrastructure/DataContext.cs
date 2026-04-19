using Microsoft.EntityFrameworkCore;
using CommunityCenter.Domain.Entities;

namespace CommunityCenter.Infrastructure
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Subscriber> Subscribers { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<TargetAudience> TargetAudiences { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<ContactRequest> ContactRequests { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<CourseRegistration> CourseRegistrations { get; set; }
        public DbSet<RegistrationEvent> EventRegistrations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // הגדרת דיוק למחירים (חובה עבור טיפוס decimal)
            modelBuilder.Entity<Event>().Property(e => e.UnitPrice).HasPrecision(18, 2);
            modelBuilder.Entity<Course>().Property(c => c.Price).HasPrecision(18, 2);

            // הגדרת קשרים לרישום אירועים
            modelBuilder.Entity<RegistrationEvent>()
                .HasOne(r => r.Subscriber)
                .WithMany(s => s.EventRegistrations)
                .HasForeignKey(r => r.SubscriberId);

            modelBuilder.Entity<RegistrationEvent>()
                .HasOne(r => r.Event)
                .WithMany(e => e.Registrations)
                .HasForeignKey(r => r.EventId);

            // הגדרת קשרים לרישום חוגים
            modelBuilder.Entity<CourseRegistration>()
                .HasOne(cr => cr.Course)
                .WithMany()
                .HasForeignKey(cr => cr.CourseId);

            modelBuilder.Entity<CourseRegistration>()
                .HasOne(cr => cr.Subscriber)
                .WithMany(s => s.CourseRegistrations)
                .HasForeignKey(cr => cr.SubscriberId);

            // --- פתרון לשגיאת Cycles or Multiple Cascade Paths ---

            // הגדרת NoAction עבור קורסים כדי למנוע לולאות מחיקה מול עובדים וקטגוריות
            modelBuilder.Entity<Course>()
                .HasOne(c => c.Employee)
                .WithMany()
                .HasForeignKey(c => c.EmployeeId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Course>()
                .HasOne(c => c.Category)
                .WithMany()
                .HasForeignKey(c => c.CategoryId)
                .OnDelete(DeleteBehavior.NoAction);

            // הגדרת NoAction עבור אירועים מול עובדים
            modelBuilder.Entity<Event>()
                .HasOne(e => e.Employee)
                .WithMany()
                .HasForeignKey(e => e.EmployeeId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}