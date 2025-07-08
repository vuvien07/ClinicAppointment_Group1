using ClinicAppointmentServer.DTO;
using ClinicAppointmentServer.Entiies;

namespace ClinicAppointmentServer.Services
{
	public interface IBookClinicService
	{
		Task CreateBookClinic(BookClinicDTO bookClinicDTO);
		Task<List<PhongKham>> GetAllClinic();
		Task AddElectronicDisease(BookClinicDTO bookClinicDTO);
	}
}
