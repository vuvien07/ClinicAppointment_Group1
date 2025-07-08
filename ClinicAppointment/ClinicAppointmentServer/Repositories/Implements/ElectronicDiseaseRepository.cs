using ClinicAppointmentServer.Entiies;

namespace ClinicAppointmentServer.Repositories.Implements
{
	public class ElectronicDiseaseRepository : IElectronicDiseaseRepository
	{
		private ClinicAppointmentContext _appointmentContext;

		public ElectronicDiseaseRepository(ClinicAppointmentContext appointmentContext)
		{
			_appointmentContext = appointmentContext;
		}
		public async Task AddElectronicDisease(BenhAnDienTu benhAnDienTu)
		{
			await _appointmentContext.BenhAnDienTus.AddAsync(benhAnDienTu);
			await _appointmentContext.SaveChangesAsync();
		}
	}
}
