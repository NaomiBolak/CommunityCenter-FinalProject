using Microsoft.AspNetCore.Mvc;

namespace CommunityCenter.API.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
