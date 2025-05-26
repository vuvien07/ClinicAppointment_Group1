using ClinicAppointmentServer.DTO;
using ClinicAppointmentServer.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> AskGemini([FromBody]PromptDTO promptDTO)
		{
			var result = await _geminiService.askGeminiAsync(promptDTO.Prompt);
			return Ok(new {result = result });
		}
    }
}
