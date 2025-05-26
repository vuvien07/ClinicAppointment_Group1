using ClinicAppointmentServer.Entiies;
using Microsoft.EntityFrameworkCore;

namespace ClinicAppointmentServer.Repositories.Implements
{
	public class AccountRepository : IAccountRepository
	{
		private ClinicAppointmentContext _appointmentContext;

		public AccountRepository(ClinicAppointmentContext appointmentContext)
		{
			_appointmentContext = appointmentContext;
		}
		public async Task<Account?> findByUsernameAndPassword(string? username, string? password)
		{
			var findAccount = await _appointmentContext.Accounts
			  .FirstOrDefaultAsync(account =>
				  account.TenDangNhap != null && account.MatKhau != null &&
				  username != null && password != null &&
				  account.TenDangNhap.Equals(username.Trim()) && account.MatKhau.Equals(password.Trim()));
			return findAccount;
		}
	}
}
