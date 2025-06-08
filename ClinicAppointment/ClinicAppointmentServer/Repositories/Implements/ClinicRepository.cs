using ClinicAppointmentServer.Entiies;
using Microsoft.EntityFrameworkCore;

namespace ClinicAppointmentServer.Repositories.Implements
{
	public class ClinicRepository : IClinicRepository
	{
		private ClinicAppointmentContext _appointmentContext;

		public ClinicRepository(ClinicAppointmentContext appointmentContext)
		{
			_appointmentContext = appointmentContext;
		}

		public async Task<List<PhongKham>> GetAllClinic()
		{
			return await _appointmentContext.PhongKhams.Include(p => p.ThongTinPhongKhams.Where(t => t.Ngay == DateOnly.FromDateTime(DateTime.Now))).ToListAsync();
		}

		public async Task<PhongKham?> GetClinic(int id)
		{
			return await _appointmentContext.PhongKhams.Include(p => p.ThongTinPhongKhams).FirstOrDefaultAsync(p => p.PhongKhamId == id);
		}
	}
}
