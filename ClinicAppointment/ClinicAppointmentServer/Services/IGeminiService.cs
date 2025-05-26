namespace ClinicAppointmentServer.Services
{
	public interface IGeminiService
	{
		Task<string> askGeminiAsync(string propmt);
	}
}
