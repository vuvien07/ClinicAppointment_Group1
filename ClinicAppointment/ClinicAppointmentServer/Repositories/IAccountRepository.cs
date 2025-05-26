using ClinicAppointmentServer.Entiies;

namespace ClinicAppointmentServer.Repositories
{
	public interface IAccountRepository
	{
		Task<Account?> findByUsernameAndPassword(string? username, string? password);
	}
}
