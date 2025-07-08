using ClinicAppointmentServer.Entiies;

namespace ClinicAppointmentServer.Repositories
{
	public interface IElectronicDiseaseRepository
	{
		Task AddElectronicDisease(BenhAnDienTu benhAnDienTu);
	}
}
