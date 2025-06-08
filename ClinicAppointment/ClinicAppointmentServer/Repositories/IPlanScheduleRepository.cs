using ClinicAppointmentServer.Entiies;

namespace ClinicAppointmentServer.Repositories
{
	public interface IPlanScheduleRepository
	{
		Task CreateAppointmentSchedule(DatLichHen datLichHen);
	}
}
