using ClinicAppointmentServer.Entiies;

namespace ClinicAppointmentServer.Repositories
{
	public interface IPatientRepository
	{
		Task AddPatient(BenhNhan benhNhan);
		Task<BenhNhan?> GetPatientByCccd(string cccd);
	}
}
