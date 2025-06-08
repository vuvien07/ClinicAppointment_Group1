using ClinicAppointmentServer.Entiies;

namespace ClinicAppointmentServer.Repositories.Implements
{
	public class PlanScheduleRepository : IPlanScheduleRepository
	{
		private ClinicAppointmentContext _appointmentContext;

		public PlanScheduleRepository(ClinicAppointmentContext appointmentContext)
		{
			_appointmentContext = appointmentContext;
		}

		public async Task CreateAppointmentSchedule(DatLichHen datLichHen)
		{
			await _appointmentContext.DatLichHens.AddAsync(datLichHen);
			await _appointmentContext.SaveChangesAsync();
		}
	}
}
