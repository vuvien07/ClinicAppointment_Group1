using System.ComponentModel.DataAnnotations;

namespace ClinicAppointmentServer.Validations
{
	public class NotEqualAttribute : ValidationAttribute
	{
		public int Num { get; set; }
		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
			if(value == null)
			{
				return new ValidationResult("Thông tin không được để trống");
			}
			if(int.Parse(value.ToString()) == Num)
			{
				return new ValidationResult("Phòng khám không được để trống");
			}

			return ValidationResult.Success;
		}
	}
}
