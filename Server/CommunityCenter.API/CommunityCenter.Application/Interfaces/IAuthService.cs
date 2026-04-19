using CommunityCenter.Application.DTOs.Auth;

public interface IAuthService
{
    Task<object> Register(RegisterDto dto);
    Task<object> Login(LoginDto dto);
}