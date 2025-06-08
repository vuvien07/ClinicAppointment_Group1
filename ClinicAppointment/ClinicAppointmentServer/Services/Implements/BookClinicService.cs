using ClinicAppointmentServer.DTO;
using ClinicAppointmentServer.Entiies;
using ClinicAppointmentServer.Repositories;
using ClinicAppointmentServer.Utils;

namespace ClinicAppointmentServer.Services.Implements
{
	public class BookClinicService : IBookClinicService
	{
		private readonly IClinicInfoRepository _clinicInfoRepository;
		private readonly IPatientRepository _patientRepository;
		private readonly IPlanScheduleRepository _planScheduleRepository;
		private readonly IClinicRepository _clinicRepository;

		public BookClinicService(IClinicInfoRepository clinicInfoRepository, IPatientRepository patientRepository, IPlanScheduleRepository planScheduleRepository, IClinicRepository clinicRepository)
		{
			_clinicInfoRepository = clinicInfoRepository;
			_patientRepository = patientRepository;
			_planScheduleRepository = planScheduleRepository;
			_clinicRepository = clinicRepository;
		}

		public async Task CreateBookClinic(BookClinicDTO bookClinicDTO)
		{
			using (var transaction = await _clinicInfoRepository.GetContext().Database.BeginTransactionAsync())
			{
				BenhNhan benhNhan = Mapper.Map<BookClinicDTO, BenhNhan>(bookClinicDTO) ?? new BenhNhan();
				DatLichHen datLichHen = Mapper.Map<BookClinicDTO, DatLichHen>(bookClinicDTO) ?? new DatLichHen();
				BenhNhan? findPatient = await _patientRepository.GetPatientByCccd(bookClinicDTO.Cccd);
				if(findPatient == null)
				{
					throw new Exception("Không tìm thấy bệnh nhân");
				}
				datLichHen.BenhNhanId = findPatient.BenhNhanId;
				datLichHen.Ngay = bookClinicDTO.Ngay;
				await _patientRepository.AddPatient(benhNhan);
				await _planScheduleRepository.CreateAppointmentSchedule(datLichHen);
				ThongTinPhongKham? thongTinPhongKham = await _clinicInfoRepository.GetClinicInfo(DateOnly.FromDateTime(DateTime.Now), bookClinicDTO.PhongKhamId ?? 0);
				if (thongTinPhongKham == null)
				{
					await transaction.RollbackAsync();
					throw new Exception("Phòng khám khó tìm thấy trong lịch học");
				}
				PhongKham? phongKham = await _clinicRepository.GetClinic(bookClinicDTO.PhongKhamId ?? 0);
				if (phongKham == null)
				{
					await transaction.RollbackAsync();
					throw new Exception("Phòng khám khó tìm thấy trong lịch học");
				}
				if (thongTinPhongKham.Hen + thongTinPhongKham.DangKy + thongTinPhongKham.Kham > phongKham.GioiHanTiepNhan) throw new Exception("Phòng khám đã đầy. Xin vui lòng chọn phòng khác");
				thongTinPhongKham.Hen += 1;
				await _clinicInfoRepository.UpdateClinicInfo(thongTinPhongKham);
				await transaction.CommitAsync();
			}
		}

		public async Task<List<PhongKham>> GetAllClinic()
		{
			return await _clinicRepository.GetAllClinic();
		}
	}
}
