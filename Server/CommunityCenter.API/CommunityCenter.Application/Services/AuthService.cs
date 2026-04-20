using CommunityCenter.Application.DTOs.Auth;
using CommunityCenter.Application.Interfaces;
using CommunityCenter.Domain.Entities;
using CommunityCenter.Domain.Exceptions;

namespace CommunityCenter.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<object> Register(RegisterDto dto)
        {
            var existing = await _userRepository.GetByEmailAsync(dto.Email);

            if (existing != null)
                throw new AppException("אימייל כבר קיים", 400);

            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                throw new AppException("אימייל וסיסמה חובה", 400);

            var existingById = await _userRepository.GetByIdentityCardAsync(dto.IdentityCard);

            if (existingById != null)
                throw new AppException("תעודת זהות כבר קיימת", 400);

            var user = new Subscriber
            {
                IdentityCard = dto.IdentityCard,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Phone = dto.Phone,
                Email = dto.Email,
                Address = dto.Address,
                BirthDate = dto.BirthDate,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                JoinDate = DateTime.Now,
                IsActive = true
            };

            await _userRepository.AddAsync(user);

            return new { message = "נרשמת בהצלחה", user.Id };
        }

        public async Task<object> Login(LoginDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new AppException("פרטים שגויים", 401);

            if (!user.IsActive)
                throw new AppException("המשתמש לא פעיל", 400);

            return new
            {
                message = "התחברת בהצלחה",
                user = new
                {
                    user.Id,
                    user.Email,
                    user.FirstName,
                    user.Role
                }
            };
        }
    }
}