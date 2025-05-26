using ClinicAppointmentServer.Entiies;

namespace ClinicAppointmentServer.Services
{
	public interface ILoginService
	{
		Task<Account?> findByUsernameAndPassword(string? username, string? password);
	}
}
