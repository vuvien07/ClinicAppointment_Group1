namespace ClinicAppointmentServer.DTO
{
	public interface IAppointmentDTO
	{
		public int LichHenId { get; set; }

		public int? BenhNhanId { get; set; }

		public int? PhongKhamId { get; set; }

		public DateOnly? Ngay { get; set; }

		public string? Gio { get; set; }

		public string? LyDoKham { get; set; }

		public string? GhiAmText { get; set; }
	}
}
