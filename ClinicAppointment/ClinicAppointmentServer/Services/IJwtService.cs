using ClinicAppointmentServer.DTO;

namespace ClinicAppointmentServer.Services
{
	public interface IJwtService
	{
		string CreateJwtToken(AccountDTO accountDTO);
	}
}
