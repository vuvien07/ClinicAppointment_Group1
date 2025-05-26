using ClinicAppointmentServer.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClinicAppointmentServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClinicInfoController : ControllerBase
    {
        private readonly IClinicInfoService _clinicInfoService;
		public ClinicInfoController(IClinicInfoService clinicInfoService)
		{
			_clinicInfoService = clinicInfoService;
		}
        [HttpGet("create")]
		public async Task<IActionResult> CreateClinicInfo()
        {
            await _clinicInfoService.CreateClinicInfo();
			return Ok();
        }
    }
}
