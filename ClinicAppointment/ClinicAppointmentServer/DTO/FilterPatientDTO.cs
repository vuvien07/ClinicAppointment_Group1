namespace ClinicAppointmentServer.DTO
{
	public class FilterPatientDTO
	{
		public int Page { get; set; }
		public int PageSize { get; set; }
		public string Gender { get; set; } = string.Empty;
		public int ClinicId { get; set; }
		public string Keyword { get; set; } = string.Empty;
		public string StartDate { get; set; } = string.Empty;
		public string EndDate { get; set; } = string.Empty;
	}
}
