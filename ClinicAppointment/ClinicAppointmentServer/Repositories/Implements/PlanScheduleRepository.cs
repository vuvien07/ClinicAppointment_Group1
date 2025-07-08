using ClinicAppointmentServer.DTO;
using ClinicAppointmentServer.Entiies;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ClinicAppointmentServer.Repositories.Implements
{
	public class PlanScheduleRepository : IPlanScheduleRepository
	{
		private ClinicAppointmentContext _appointmentContext;

		public PlanScheduleRepository(ClinicAppointmentContext appointmentContext)
		{
			_appointmentContext = appointmentContext;
		}

		public async Task<long> CountAppointment(FilterPatientDTO filterPatientDTO)
		{
			var result = GetSchedulesByCondition(GetAllSchedules(), filterPatientDTO);
			return await result.CountAsync();
		}

		public async Task CreateAppointmentSchedule(DatLichHen datLichHen)
		{
			await _appointmentContext.DatLichHens.AddAsync(datLichHen);
			await _appointmentContext.SaveChangesAsync();
		}

		public async Task<List<ScheduleAppointmentDTO>> GetAppointmentSchedules(FilterPatientDTO filterPatientDTO)
		{
			var result = GetSchedulesByCondition(GetAllSchedules(), filterPatientDTO);
			long count = await result.CountAsync();
			int totalPage = (int)Math.Ceiling((double)count / filterPatientDTO.PageSize);
			if (filterPatientDTO.Page <= totalPage)
			{
				result = result.Skip((filterPatientDTO.Page - 1) * filterPatientDTO.PageSize).Take(filterPatientDTO.PageSize);
			}
			return await result.ToListAsync();
		}

		private IQueryable<ScheduleAppointmentDTO> GetAllSchedules()
		{
			var query = _appointmentContext.DatLichHens.Include(dlh => dlh.PhongKham).Include(dlh => dlh.BenhNhan)
				.Select(dlh => new ScheduleAppointmentDTO
				{
					LichHenId = dlh.LichHenId,
					Ngay = dlh.Ngay,
					Gio = dlh.Gio,
					LyDoKham = dlh.LyDoKham,
					ClinicDTO = new()
					{
						PhongKhamId = dlh.PhongKham!.PhongKhamId,
						TenPhong = dlh.PhongKham!.TenPhong
					},
					PatientDTO = new()
					{
						Cccd = dlh.BenhNhan!.Cccd,
						HovaTen = dlh.BenhNhan.HovaTen,
						SoDienThoai = dlh.BenhNhan.SoDienThoai,
						GioiTinh = dlh.BenhNhan.GioiTinh,
						NgaySinh = dlh.BenhNhan.NgaySinh,
						DiaChi = dlh.BenhNhan.DiaChi,
						DanToc = dlh.BenhNhan.DanToc,
						NgheNghiep = dlh.BenhNhan.NgheNghiep,
					}
				});
			return query;
		}

		private IAsyncEnumerable<ScheduleAppointmentDTO> GetSchedulesByCondition(IQueryable<ScheduleAppointmentDTO> query, FilterPatientDTO filterPatientDTO)
		{
			var result = query;
			if (!filterPatientDTO.Gender.IsNullOrEmpty())
			{
				result = result.Where(s => s.PatientDTO!.GioiTinh == filterPatientDTO.Gender);
			}
			if (filterPatientDTO.ClinicId != 0)
			{
				result = result.Where(s => s.ClinicDTO!.PhongKhamId == filterPatientDTO.ClinicId);
			}
			if (!filterPatientDTO.Keyword.IsNullOrEmpty())
			{
				result = result.Where(s => s.PatientDTO!.HovaTen!.Contains(filterPatientDTO.Keyword) || s.PatientDTO!.DiaChi!.Contains(filterPatientDTO.Keyword));
			}
			if (!filterPatientDTO.StartDate.IsNullOrEmpty() && !filterPatientDTO.EndDate.IsNullOrEmpty())
			{
				DateOnly startDate, endDate;

				if (!DateOnly.TryParse(filterPatientDTO.StartDate!, out startDate))
					startDate = DateOnly.FromDateTime(DateTime.Now);

				if (!DateOnly.TryParse(filterPatientDTO.EndDate!, out endDate))
					endDate = DateOnly.FromDateTime(DateTime.Now);

				result = result.Where(s => s.Ngay >= startDate && s.Ngay <= endDate);
			}
			else if (!filterPatientDTO.StartDate.IsNullOrEmpty() && filterPatientDTO.EndDate.IsNullOrEmpty())
			{
				DateOnly startDate;

				if (!DateOnly.TryParse(filterPatientDTO.StartDate!, out startDate))
					startDate = DateOnly.FromDateTime(DateTime.Now);

				result = result.Where(s => s.Ngay >= startDate && s.Ngay <= DateOnly.FromDateTime(DateTime.MaxValue));
			}
			else if (filterPatientDTO.StartDate.IsNullOrEmpty() && !filterPatientDTO.EndDate.IsNullOrEmpty())
			{
				DateOnly endDate;

				if (!DateOnly.TryParse(filterPatientDTO.EndDate!, out endDate))
					endDate = DateOnly.FromDateTime(DateTime.Now);

				result = result.Where(s => s.Ngay >= DateOnly.FromDateTime(DateTime.MinValue) && s.Ngay <= endDate);
			}
			return result.AsAsyncEnumerable();
		}
	}
}
