using ClinicAppointmentServer.DTO;
using ClinicAppointmentServer.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClinicAppointmentServer.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PatientController : ControllerBase
	{
		private readonly IPatientService _patientService;
		public PatientController(IPatientService patientService)
		{
			_patientService = patientService;
		}
		[HttpPost]
		public async Task<IActionResult> GetAllPatient([FromBody] FilterPatientDTO filterPatientDTO)
		{
			return Ok(new
			{
				page = filterPatientDTO.Page,
				schedules = await _patientService.GetAllPatientSchedule(filterPatientDTO),
				totalPage = (int)Math.Ceiling((double)(await _patientService.GetTotalPatientSchedule(filterPatientDTO)) / filterPatientDTO.PageSize)
			});
		}
	}
}
