namespace ClinicAppointmentServer.DTO.Implements
{
	public class ClinicDTO : IClinicDTO
	{
		public int PhongKhamId { get; set; }
		public string? TenPhong{get;set;}
		public int? GioiHanTiepNhan{get;set;}
		public List<ClinicInfoDTO> ThongTinPhongKhams { get; set; } = new List<ClinicInfoDTO>();
	}
}
