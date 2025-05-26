
namespace ClinicAppointmentServer.DTO.Implements
{
	public class PatientDTO : IPatientDTO
	{
		public string? HovaTen{get;set;}
		public string? GioiTinh{get;set;}
		public DateOnly? NgaySinh{get;set;}
		public string? SoDienThoai{get;set;}
		public string? DiaChi{get;set;}
		public string? Cccd{get;set;}
		public string? NgheNghiep{get;set;}
		public string? DanToc{get;set;}
	}
}
