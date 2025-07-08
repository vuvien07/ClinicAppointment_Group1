using ClinicAppointmentServer.DTO;
using ClinicAppointmentServer.Entiies;

namespace ClinicAppointmentServer.Repositories
{
	public interface IPlanScheduleRepository
	{
		Task CreateAppointmentSchedule(DatLichHen datLichHen);
		Task<List<ScheduleAppointmentDTO>> GetAppointmentSchedules(FilterPatientDTO filterPatientDTO);
		Task<long> CountAppointment(FilterPatientDTO filterPatientDTO);
	}
}
