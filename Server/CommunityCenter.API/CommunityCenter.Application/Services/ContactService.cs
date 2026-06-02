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
            return messages.Select(m =>
            {
                var (subject, body) = SplitSubjectFromMessage(m.Message);
                return new ContactRequestDto
                {
                    Id = m.Id,
                    Name = m.SenderName,
                    SenderName = m.SenderName,
                    Email = m.Email,
                    Phone = m.Phone,
                    Subject = subject,
                    Message = body,
                    CreatedAt = m.CreatedAt,
                    IsHandled = m.IsHandled
                };
            });
        }

        public async Task SendMessageAsync(ContactRequestDto dto)
        {
            var senderName = !string.IsNullOrWhiteSpace(dto.Name) ? dto.Name : dto.SenderName;
            var messageBody = string.IsNullOrWhiteSpace(dto.Subject)
                ? dto.Message
                : $"[{dto.Subject}] {dto.Message}";

            var entity = new ContactRequest
            {
                SenderName = senderName,
                Email = dto.Email,
                Phone = dto.Phone,
                Message = messageBody,
                CreatedAt = DateTime.Now,
                IsHandled = false
            };
            await _contactRepository.AddAsync(entity);
            await _logger.Info($"הודעה חדשה נשלחה על ידי {senderName}");
        }

        private static (string Subject, string Body) SplitSubjectFromMessage(string message)
        {
            if (message.StartsWith('['))
            {
                var closingIndex = message.IndexOf(']');
                if (closingIndex > 1)
                {
                    var subject = message.Substring(1, closingIndex - 1);
                    var body = message.Substring(closingIndex + 1).TrimStart();
                    return (subject, body);
                }
            }

            return (string.Empty, message);
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