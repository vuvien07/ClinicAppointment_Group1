using ClinicAppointmentServer.DTO;
using ClinicAppointmentServer.DTO.Implements;
using ClinicAppointmentServer.Entiies;
using ClinicAppointmentServer.Services;
using ClinicAppointmentServer.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClinicAppointmentServer.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class BookClinicController : ControllerBase
	{
		private readonly IBookClinicService _bookClinicService;

		public BookClinicController(IBookClinicService bookClinicService)
		{
			_bookClinicService = bookClinicService;
		}

		[HttpGet("all")]
		public async Task<IActionResult> GetAllBookClinic()
		{
			var list = await _bookClinicService.GetAllClinic();
			var result = list.Select(x => Mapper.Map<PhongKham, ClinicDTO>(x)).ToList();
			return Ok(result);
		}

		[HttpPost("create")]
		public async Task<IActionResult> BookClinic([FromBody] BookClinicDTO bookClinicDTO)
		{
			bool isValid = TryValidateModel(bookClinicDTO);
			if (!isValid)
			{
				var errors = new Dictionary<string, string>();

				foreach (var key in ModelState.Keys)
				{
					var entry = ModelState[key];
					if (entry != null && entry.Errors.Count > 0)
					{
						var firstError = entry.Errors.First();
						errors.TryAdd(key, firstError.ErrorMessage);
					}
				}
				return BadRequest(new { errors = errors });
			}
			await _bookClinicService.CreateBookClinic(bookClinicDTO);
			return Ok(new { message = "Đặt lịch thành công" });
		}
	}
}
