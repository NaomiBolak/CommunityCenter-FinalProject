using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommunityCenter.Application.DTOs;
using CommunityCenter.Application.Interfaces;
using CommunityCenter.Domain.Entities;
using CommunityCenter.Application.Services;

namespace CommunityCenter.Application.Services
{
    public class ContactService : IContactService
    {
        private readonly IContactRepository _contactRepository;
        private readonly ILoggerService _logger;

        public ContactService(IContactRepository contactRepository, ILoggerService logger)
        {
            _contactRepository = contactRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<ContactRequestDto>> GetMessagesAsync()
        {
            var messages = await _contactRepository.GetAllAsync();
            await _logger.Info($"נמשכו {messages.Count()} הודעות מהמאגר");
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
            await _logger.Info($"הודעה חדשה נשלחה על ידי {dto.SenderName}");
        }

        public async Task MarkAsHandledAsync(int id)
        {
            var message = await _contactRepository.GetByIdAsync(id);
            if (message != null)
            {
                message.IsHandled = true;
                await _contactRepository.UpdateAsync(message);
                await _logger.Info($"הודעה עם ID {id} סומנה כטופלה");
            }
        }
    }
}