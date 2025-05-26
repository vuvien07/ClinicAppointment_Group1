using ClinicAppointmentServer.DTO;

namespace ClinicAppointmentServer.Services
{
	public interface IBookClinicService
	{
		Task CreateBookClinic(BookClinicDTO bookClinicDTO);
	}
}
