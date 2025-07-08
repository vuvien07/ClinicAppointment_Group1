using ClinicAppointmentServer.DTO.Implements;

namespace ClinicAppointmentServer.DTO
{
	public class ScheduleAppointmentDTO
	{
		public int LichHenId { get; set; }
		public DateOnly? Ngay { get; set; }

		public string? Gio { get; set; }

		public string? LyDoKham { get; set; }

		public PatientDTO? PatientDTO { get; set; }
		public ClinicDTO? ClinicDTO { get; set; }
	}
}
