using CommunityCenter.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CommunityCenter.Infrastructure
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        // ======================
        // DbSets
        // ======================

        public DbSet<Subscriber> Subscribers { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<CourseRegistration> CourseRegistrations { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<ContactRequest> ContactRequests { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<TargetAudience> TargetAudiences { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<RegistrationEvent> EventRegistrations { get; set; }
        // ======================
        // Fluent API
        // ======================

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ======================
            // Subscriber
            // ======================

            modelBuilder.Entity<Subscriber>()
                .HasIndex(x => x.Email)
                .IsUnique();

            modelBuilder.Entity<Subscriber>()
                .HasIndex(x => x.IdentityCard)
                .IsUnique();

            modelBuilder.Entity<Subscriber>()
                .Property(x => x.Role)
                .HasMaxLength(20);

            // ======================
            // Course
            // ======================

            modelBuilder.Entity<Course>()
                .Property(x => x.Price)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Course>()
                .Property(x => x.ImagePath)
                .HasMaxLength(300);

            // ======================
            // Event
            // ======================

            modelBuilder.Entity<Event>()
                .Property(x => x.UnitPrice)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Event>()
                .Property(x => x.ImagePath)
                .HasMaxLength(300);

            // ======================
            // News
            // ======================

            modelBuilder.Entity<News>()
                .Property(x => x.ImagePath)
                .HasMaxLength(300);

            // ======================
            // מניעת הרשמה כפולה לחוג
            // ======================

            modelBuilder.Entity<CourseRegistration>()
                .HasIndex(x => new { x.CourseId, x.SubscriberId })
                .IsUnique();

            // ======================
            // מניעת הרשמה כפולה לאירוע
            // ======================

            modelBuilder.Entity<RegistrationEvent>()
                .HasIndex(x => new { x.EventId, x.SubscriberId })
                .IsUnique();
            modelBuilder.Entity<RegistrationEvent>().ToTable("EventRegistrations");
            // ======================
            // קשרים (Relations - מומלץ לחזק)
            // ======================

            modelBuilder.Entity<Course>()
                .HasOne(c => c.Category)
                .WithMany()
                .HasForeignKey(c => c.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Course>()
                .HasOne(c => c.Employee)
                .WithMany()
                .HasForeignKey(c => c.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Event>()
                .HasOne(e => e.Employee)
                .WithMany()
                .HasForeignKey(e => e.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RegistrationEvent>()
                .HasOne(r => r.Event)
                .WithMany(e => e.EventRegistration)
                .HasForeignKey(r => r.EventId);

            modelBuilder.Entity<CourseRegistration>()
                .HasOne(r => r.Course)
                .WithMany()
                .HasForeignKey(r => r.CourseId);
        }
    }
}