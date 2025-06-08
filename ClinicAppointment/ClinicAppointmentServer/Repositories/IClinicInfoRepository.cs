using ClinicAppointmentServer.Entiies;

namespace ClinicAppointmentServer.Repositories
{
	public interface IClinicInfoRepository
	{
		Task<ThongTinPhongKham?> GetClinicInfo(int id, DateOnly date);
		Task CreateClinicInfo(ThongTinPhongKham thongTinPhongKham);
		Task<ThongTinPhongKham?> GetClinicInfo(DateOnly date, int clinicId);

		Task UpdateClinicInfo(ThongTinPhongKham thongTinPhongKham);
		ClinicAppointmentContext GetContext();
	}
}
