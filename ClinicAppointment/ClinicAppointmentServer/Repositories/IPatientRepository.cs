using ClinicAppointmentServer.Entiies;

namespace ClinicAppointmentServer.Repositories
{
	public interface IPatientRepository
	{
		Task AddPatient(BenhNhan benhNhan);
		Task<BenhNhan?> GetPatientByCccdAndPhone(string cccd, string phone);
	}
}
