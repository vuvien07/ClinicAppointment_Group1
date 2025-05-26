
using ClinicAppointmentServer.Entiies;
using ClinicAppointmentServer.Repositories;

namespace ClinicAppointmentServer.Services.Implements
{
	public class ClinicInfoService : IClinicInfoService
	{
		private readonly IClinicRepository _clinicRepository;
		private readonly IClinicInfoRepository _clinicInfoRepository;

		public ClinicInfoService(IClinicRepository clinicRepository, IClinicInfoRepository clinicInfoRepository)
		{
			_clinicRepository = clinicRepository;
			_clinicInfoRepository = clinicInfoRepository;
		}

		public async Task CreateClinicInfo()
		{
			List<PhongKham> clinics = await _clinicRepository.GetAllClinic();
			foreach (PhongKham clinic in clinics)
			{
				ThongTinPhongKham? clinicInfo = await _clinicInfoRepository.GetClinicInfo(clinic.PhongKhamId, DateOnly.FromDateTime(DateTime.Now));
				if(clinicInfo == null)
				{
					ThongTinPhongKham thongTinPhongKham = new()
					{
						PhongKhamId = clinic.PhongKhamId,
						Ngay = DateOnly.FromDateTime(DateTime.Now),
						Hen = 0,
						DangKy = 0,
						Kham = 0,
						Status = true
					};
					await _clinicInfoRepository.CreateClinicInfo(thongTinPhongKham);
				}
			}
		}
	}
}
