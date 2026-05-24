using CommunityCenter.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCenter.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = int.Parse(
                User.FindFirst("UserId")!.Value
            );

            var profile = await _profileService.GetMyProfile(userId);

            return Ok(profile);
        }
    }
}