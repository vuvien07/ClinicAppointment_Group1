
namespace ClinicAppointmentServer.DTO.Implements
{
	public class AppointmentDTO : IAppointmentDTO
	{
		public int LichHenId{get;set;}
		public int? BenhNhanId{get;set;}
		public int? PhongKhamId{get;set;}
		public DateOnly? Ngay{get;set;}
		public string? Gio{get;set;}
		public string? LyDoKham{get;set;}
		public string? GhiAmText{get;set;}
	}
}
