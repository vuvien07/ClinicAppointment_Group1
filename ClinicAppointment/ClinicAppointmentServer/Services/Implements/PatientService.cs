using ClinicAppointmentServer.DTO;
using ClinicAppointmentServer.Repositories;

namespace ClinicAppointmentServer.Services.Implements
{
	public class PatientService : IPatientService
	{
		private readonly IPlanScheduleRepository _planScheduleRepository;

		public PatientService(IPlanScheduleRepository planScheduleRepository)
		{
			_planScheduleRepository = planScheduleRepository;
		}

		public async Task<List<ScheduleAppointmentDTO>> GetAllPatientSchedule(FilterPatientDTO filterPatientDTO)
		{
			return await _planScheduleRepository.GetAppointmentSchedules(filterPatientDTO);
		}

		public async Task<long> GetTotalPatientSchedule(FilterPatientDTO filterPatientDTO)
		{
			return await _planScheduleRepository.CountAppointment(filterPatientDTO);
		}
	}
}
