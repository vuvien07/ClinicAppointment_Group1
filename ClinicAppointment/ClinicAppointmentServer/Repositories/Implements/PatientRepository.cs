using ClinicAppointmentServer.Entiies;
using Microsoft.EntityFrameworkCore;

namespace ClinicAppointmentServer.Repositories.Implements
{
	public class PatientRepository : IPatientRepository
	{
		private ClinicAppointmentContext _appointmentContext;

		public PatientRepository(ClinicAppointmentContext appointmentContext)
		{
			_appointmentContext = appointmentContext;
		}
		public async Task AddPatient(BenhNhan benhNhan)
		{
			await _appointmentContext.BenhNhans.AddAsync(benhNhan);
			await _appointmentContext.SaveChangesAsync();
		}

		public async Task<BenhNhan?> GetPatientByCccdAndPhone(string cccd, string phone)
		{
			return await _appointmentContext.BenhNhans.FirstOrDefaultAsync(b => b.Cccd == cccd && b.SoDienThoai == phone);
		}
	}
}
