using System.ComponentModel.DataAnnotations;

namespace ClinicAppointmentServer.DTO
{
	public class LoginDTO
	{
		[Required(ErrorMessage = "Tên người dùng không được để trống")]
		public string? Username { get; set; }
		[Required(ErrorMessage = "Mật khẩu không được để trống")]
		public string? Password { get; set; }
	}
}
