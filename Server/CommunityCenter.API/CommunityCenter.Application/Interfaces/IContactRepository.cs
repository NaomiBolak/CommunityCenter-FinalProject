using System.Collections.Generic;
using System.Threading.Tasks;
using CommunityCenter.Domain.Entities;

namespace CommunityCenter.Application.Interfaces
{
    public interface IContactRepository
    {
        Task<IEnumerable<ContactRequest>> GetAllAsync();
        Task<ContactRequest?> GetByIdAsync(int id);
        Task AddAsync(ContactRequest contactRequest);
        Task UpdateAsync(ContactRequest contactRequest);
    }
}