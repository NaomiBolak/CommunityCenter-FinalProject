using System.Collections.Generic;
using System.Threading.Tasks;
using CommunityCenter.Application.DTOs;

namespace CommunityCenter.Application.Interfaces
{
    public interface IContactService
    {
        Task<IEnumerable<ContactRequestDto>> GetMessagesAsync();
        Task SendMessageAsync(ContactRequestDto dto);
        Task MarkAsHandledAsync(int id);
    }
}
