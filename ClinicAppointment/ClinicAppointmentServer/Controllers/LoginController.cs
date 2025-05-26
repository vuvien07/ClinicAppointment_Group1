using ClinicAppointmentServer.DTO;
using ClinicAppointmentServer.Entiies;
using ClinicAppointmentServer.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClinicAppointmentServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
		private readonly ILoginService _loginService;

		public LoginController(ILoginService loginService)
		{
			_loginService = loginService;
		}

		[HttpPost]
		public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
		{
			if (!ModelState.IsValid)
			{
				var errors = ModelState.Values.Select(v => v.Errors?.FirstOrDefault()?.ErrorMessage);
				return BadRequest(errors);
			}
			Account? account = await _loginService.findByUsernameAndPassword(loginDTO.Username, loginDTO.Password);
			if (account == null) return BadRequest(new { message = "Username or password is incorrect" });
			return Ok(new { message = "Login successfully" });
		}
	}
}
