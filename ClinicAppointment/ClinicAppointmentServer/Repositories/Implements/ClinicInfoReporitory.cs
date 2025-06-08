using ClinicAppointmentServer.Entiies;
using Microsoft.EntityFrameworkCore;

namespace ClinicAppointmentServer.Repositories.Implements
{
	public class ClinicInfoReporitory : IClinicInfoRepository
	{
		private ClinicAppointmentContext _appointmentContext;

		public ClinicInfoReporitory(ClinicAppointmentContext appointmentContext)
		{
			_appointmentContext = appointmentContext;
		}

		public async Task CreateClinicInfo(ThongTinPhongKham thongTinPhongKham)
		{
			await _appointmentContext.ThongTinPhongKhams.AddAsync(thongTinPhongKham);
			await _appointmentContext.SaveChangesAsync();
		}

		public async Task<ThongTinPhongKham?> GetClinicInfo(int id, DateOnly date)
		{
			return await _appointmentContext.ThongTinPhongKhams.FirstOrDefaultAsync(t => t.PhongKhamId == id && t.Ngay == date);
		}

		public async Task<ThongTinPhongKham?> GetClinicInfo(DateOnly date, int clinicId)
		{
			return await _appointmentContext.ThongTinPhongKhams.FirstOrDefaultAsync(t => t.PhongKhamId == clinicId && t.Ngay == date);
		}

		public ClinicAppointmentContext GetContext()
		{
			return _appointmentContext;
		}

		public async Task UpdateClinicInfo(ThongTinPhongKham thongTinPhongKham)
		{
			_appointmentContext.ThongTinPhongKhams.Update(thongTinPhongKham);
			await _appointmentContext.SaveChangesAsync();
		}
	}
}
