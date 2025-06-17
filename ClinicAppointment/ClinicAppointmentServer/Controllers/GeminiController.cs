using ClinicAppointmentServer.DTO;
using ClinicAppointmentServer.Proxy;
using ClinicAppointmentServer.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace ClinicAppointmentServer.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class GeminiController : ControllerBase
	{
		private readonly IGeminiService _geminiService;
		public GeminiController(IGeminiService geminiService)
		{
			_geminiService = geminiService;
		}
		[HttpPost("ask")]
		public async Task<IActionResult> AskGemini([FromHeader] string token,[FromBody] PromptDTO promptDTO)
		{
			if (token == null) return BadRequest(new { message = "Token is null" });
			Dictionary<string, string> dic = UtilHelper.DecodeToken(token) as Dictionary<string, string> ?? new Dictionary<string, string>();
			var result = await _geminiService.askGeminiAsync(dic["UserId"],promptDTO.Prompt);
			return Ok(new { result = result });
		}
	}
}
