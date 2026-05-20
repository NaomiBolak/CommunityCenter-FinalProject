using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommunityCenter.Application.DTOs;
using CommunityCenter.Application.Interfaces;
using CommunityCenter.Domain.Entities;

namespace CommunityCenter.Application.Services
{
    public class ContactService : IContactService
    {
        private readonly IContactRepository _contactRepository;

        public ContactService(IContactRepository contactRepository)
        {
            _contactRepository = contactRepository;
        }

        public async Task<IEnumerable<ContactRequestDto>> GetMessagesAsync()
        {
            var messages = await _contactRepository.GetAllAsync();
            return messages.Select(m => new ContactRequestDto
            {
                Id = m.Id,
                SenderName = m.SenderName,
                Message = m.Message,
                CreatedAt = m.CreatedAt,
                IsHandled = m.IsHandled
            });
        }

        public async Task SendMessageAsync(ContactRequestDto dto)
        {
            var entity = new ContactRequest
            {
                SenderName = dto.SenderName,
                Message = dto.Message,
                CreatedAt = DateTime.Now,
                IsHandled = false
            };
            await _contactRepository.AddAsync(entity);
        }

        public async Task MarkAsHandledAsync(int id)
        {
            var message = await _contactRepository.GetByIdAsync(id);
            if (message != null)
            {
                message.IsHandled = true;
                await _contactRepository.UpdateAsync(message);
            }
        }
    }
}