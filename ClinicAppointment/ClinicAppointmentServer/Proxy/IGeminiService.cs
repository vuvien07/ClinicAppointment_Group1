namespace ClinicAppointmentServer.Proxy
{
	public interface IGeminiService
	{
		Task<string> askGeminiAsync(string userId, string propmt);
	}
}
