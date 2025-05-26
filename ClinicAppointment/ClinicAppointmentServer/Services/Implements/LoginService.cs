using ClinicAppointmentServer.Entiies;
using ClinicAppointmentServer.Repositories;

namespace ClinicAppointmentServer.Services.Implements
{
	public class LoginService : ILoginService
	{
		private readonly IAccountRepository _accountRepository;

		public LoginService(IAccountRepository accountRepository)
		{
			_accountRepository = accountRepository;
		}

		public async Task<Account?> findByUsernameAndPassword(string? username, string? password)
		{
			return await _accountRepository.findByUsernameAndPassword(username, password);
		}
	}
}
