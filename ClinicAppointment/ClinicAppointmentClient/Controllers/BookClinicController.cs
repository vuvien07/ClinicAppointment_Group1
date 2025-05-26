using Microsoft.AspNetCore.Mvc;

namespace ClinicAppointmentClient.Controllers
{
    public class BookClinicController : Controller
    {
        public IActionResult Index()
        {
            return View("~/Views/BookClinic.cshtml");
        }
    }
}
