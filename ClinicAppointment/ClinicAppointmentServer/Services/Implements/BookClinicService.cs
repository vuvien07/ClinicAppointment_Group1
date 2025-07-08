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
		private readonly IElectronicDiseaseRepository _electronicDiseaseRepository;

		public BookClinicService(IClinicInfoRepository clinicInfoRepository, IPatientRepository patientRepository, IPlanScheduleRepository planScheduleRepository, IClinicRepository clinicRepository, IElectronicDiseaseRepository electronicDiseaseRepository)
		{
			_clinicInfoRepository = clinicInfoRepository;
			_patientRepository = patientRepository;
			_planScheduleRepository = planScheduleRepository;
			_clinicRepository = clinicRepository;
			_electronicDiseaseRepository = electronicDiseaseRepository;
		}

		public async Task AddElectronicDisease(BookClinicDTO bookClinicDTO)
		{
			using (var transaction = await _clinicInfoRepository.GetContext().Database.BeginTransactionAsync())
			{
				if (bookClinicDTO.LichHenId == 0)
				{
					throw new Exception("Không thể thêm bệnh án điện tử vì chưa có lịch hẹn");
				}
				BenhAnDienTu benhAnDienTu = new()
				{
					BenhNhanId = bookClinicDTO.BenhNhanId,
					LichHenId = bookClinicDTO.LichHenId,
					NgayTao = DateOnly.FromDateTime(DateTime.Now)
				};
				await _electronicDiseaseRepository.AddElectronicDisease(benhAnDienTu);
				ThongTinPhongKham? thongTinPhongKham = await _clinicInfoRepository.GetClinicInfo(bookClinicDTO.PhongKhamId ?? 0, DateOnly.FromDateTime(DateTime.Now));
				if (thongTinPhongKham == null)
				{
					throw new Exception("Không thể thêm bệnh án điện tử vì chưa có thông tin phòng khám");
				}
				thongTinPhongKham.Hen -= 1;
				thongTinPhongKham.DangKy += 1;
				await _clinicInfoRepository.UpdateClinicInfo(thongTinPhongKham);
				await transaction.CommitAsync();
			}
		}

		public async Task CreateBookClinic(BookClinicDTO bookClinicDTO)
		{
			using (var transaction = await _clinicInfoRepository.GetContext().Database.BeginTransactionAsync())
			{
				BenhNhan benhNhan = Mapper.Map<BookClinicDTO, BenhNhan>(bookClinicDTO) ?? new BenhNhan();
				DatLichHen datLichHen = Mapper.Map<BookClinicDTO, DatLichHen>(bookClinicDTO) ?? new DatLichHen();
				BenhNhan? findPatient = await _patientRepository.GetPatientByCccdAndPhone(bookClinicDTO.Cccd, bookClinicDTO.SoDienThoai);
				if(findPatient == null)
				{
					await _patientRepository.AddPatient(benhNhan);
					datLichHen.BenhNhanId = findPatient.BenhNhanId;
					datLichHen.Ngay = bookClinicDTO.Ngay;
					datLichHen.Gio = bookClinicDTO.Gio;
				}
				else
				{
					datLichHen.BenhNhanId = findPatient.BenhNhanId;
					datLichHen.Ngay = bookClinicDTO.Ngay;
					datLichHen.Gio = bookClinicDTO.Gio;
				}
				ThongTinPhongKham? thongTinPhongKham = await _clinicInfoRepository.GetClinicInfo(DateOnly.FromDateTime(DateTime.Now), bookClinicDTO.PhongKhamId ?? 0);
				if (thongTinPhongKham == null)
				{
					await transaction.RollbackAsync();
					throw new Exception("Thông tin phòng khám không tìm thấy trong lịch");
				}
				PhongKham? phongKham = await _clinicRepository.GetClinic(bookClinicDTO.PhongKhamId ?? 0);
				if (phongKham == null)
				{
					await transaction.RollbackAsync();
					throw new Exception("Phòng khám không tìm thấy");
				}
				if (thongTinPhongKham.Hen + thongTinPhongKham.DangKy + thongTinPhongKham.Kham > phongKham.GioiHanTiepNhan) throw new Exception("Phòng khám đã đầy. Xin vui lòng chọn phòng khác");
				thongTinPhongKham.Hen += 1;
				await _clinicInfoRepository.UpdateClinicInfo(thongTinPhongKham);
				await _planScheduleRepository.CreateAppointmentSchedule(datLichHen);
				await transaction.CommitAsync();
			}
		}

		public async Task<List<PhongKham>> GetAllClinic()
		{
			return await _clinicRepository.GetAllClinic();
		}
	}
}
