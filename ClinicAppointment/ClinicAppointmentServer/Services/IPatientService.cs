using ClinicAppointmentServer.DTO;

namespace ClinicAppointmentServer.Services
{
	public interface IPatientService
	{
		Task<List<ScheduleAppointmentDTO>> GetAllPatientSchedule(FilterPatientDTO filterPatientDTO);
		Task<long> GetTotalPatientSchedule(FilterPatientDTO filterPatientDTO);
	}
}
