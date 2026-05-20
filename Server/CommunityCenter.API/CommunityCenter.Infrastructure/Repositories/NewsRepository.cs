using CommunityCenter.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using CommunityCenter.Application.Interfaces; // הוסיפי את זה
namespace CommunityCenter.Infrastructure.Repositories
{
    public class NewsRepository : INewsRepository
    {
        private readonly DataContext _context; // כאן השם צריך להיות זהה לשם הקובץ DataContext.cs

        public NewsRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<News>> GetAllAsync()
        {
            return await _context.News.ToListAsync();
        }

        public async Task AddAsync(News news)
        {
            await _context.News.AddAsync(news);
            await _context.SaveChangesAsync();
        }
    }
}