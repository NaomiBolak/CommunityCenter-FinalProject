using CommunityCenter.Application.DTOs.Profile;

namespace CommunityCenter.Application.Interfaces
{
    public interface IProfileService
    {
        Task<ProfileDto?> GetMyProfile(int userId);
    }
}