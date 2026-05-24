using CommunityCenter.Application.DTOs.Profile;
using CommunityCenter.Application.Interfaces;

namespace CommunityCenter.Application.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IProfileRepository _profileRepository;

        public ProfileService(IProfileRepository profileRepository)
        {
            _profileRepository = profileRepository;
        }

        public async Task<ProfileDto?> GetMyProfile(int userId)
        {
            return await _profileRepository.GetProfileAsync(userId);
        }
    }
}