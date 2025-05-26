using ClinicAppointmentServer.Entiies;

namespace ClinicAppointmentServer.Repositories
{
	public interface IClinicRepository
	{
		Task<List<PhongKham>> GetAllClinic();
	}
}
