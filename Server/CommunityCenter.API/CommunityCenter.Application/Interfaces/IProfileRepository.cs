using CommunityCenter.Application.DTOs.Profile;

namespace CommunityCenter.Application.Interfaces
{
    public interface IProfileRepository
    {
        Task<ProfileDto?> GetProfileAsync(int userId);
    }
}