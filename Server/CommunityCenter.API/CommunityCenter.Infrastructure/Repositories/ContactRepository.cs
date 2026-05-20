using System.Collections.Generic;
using System.Threading.Tasks;
using CommunityCenter.Application.Interfaces;
using CommunityCenter.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CommunityCenter.Infrastructure.Repositories
{
    public class ContactRepository : IContactRepository
    {
        private readonly DataContext _context;

        public ContactRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ContactRequest>> GetAllAsync()
        {
            return await _context.Set<ContactRequest>().ToListAsync();
        }

        public async Task<ContactRequest?> GetByIdAsync(int id)
        {
            return await _context.Set<ContactRequest>().FindAsync(id);
        }

        public async Task AddAsync(ContactRequest contactRequest)
        {
            await _context.Set<ContactRequest>().AddAsync(contactRequest);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ContactRequest contactRequest)
        {
            _context.Set<ContactRequest>().Update(contactRequest);
            await _context.SaveChangesAsync();
        }
    }
}