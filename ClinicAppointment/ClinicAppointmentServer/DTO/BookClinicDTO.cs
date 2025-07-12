
using ClinicAppointmentServer.Validations;
using System.ComponentModel.DataAnnotations;

namespace ClinicAppointmentServer.DTO
{
	public class BookClinicDTO : IAppointmentDTO, IPatientDTO
	{
		[Required(ErrorMessage = "Vui lòng nhập họ và tên")]
		[MinLength(1, ErrorMessage = "Họ và tên không được quá 501212 ký tự")]
		public string? HovaTen{get;set;}
		[Required(ErrorMessage = "Giới tính không được để trống")]
		public string? GioiTinh{get;set;}
		[Required(ErrorMessage = "Vui lòng nhập ngày sinh")]
		public string? NgaySinhStr{get;set;}
		public DateOnly? NgaySinh{get => DateOnly.TryParse(NgaySinhStr, out var date) ? date : null;
			set => value?.ToString("yyyy-MM-dd"); }
		[Required(ErrorMessage = "Vui lòng nhập số điện thoại")]
		[Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
		public string? SoDienThoai{get;set;}
		public string? DiaChi{get;set;}
		[Required(ErrorMessage = "Vui lòng nhập số CCCD")]
		public string? Cccd{get;set;}
		[Required(ErrorMessage = "Vui lòng nhập nghề nghiệp")]
		public string? NgheNghiep{get;set;}
		//[Required(ErrorMessage = "Vui lòng nhập dân tộc")]
		public string? DanToc{get;set;}
		public int LichHenId{get;set;}
		public int? BenhNhanId{get;set;}
		[NotEqual(Num =0)]
		public int? PhongKhamId{get;set;}
		public DateOnly? Ngay{get;set;}
		//[Required(ErrorMessage = "Vui lòng nhập giờ khám")]
		public string? Gio{get;set;}
		[Required(ErrorMessage = "Vui lòng nhập lý do khám")]
		public string? LyDoKham{get;set;}
		public string? GhiAmText{get;set;}
		[Required(ErrorMessage ="Vui lòng chọn quốc tịch")]
		public string? QuocTich { get; set; }
	}
}
