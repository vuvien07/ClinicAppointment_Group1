namespace ClinicAppointmentServer.Proxy
{
	public interface IConversationService
	{
		Task<ConversationState> GetOrCreateAsync(string userId);
		Task SaveAsync(string userId, ConversationState state);
		Task ResetAsync(string userId);
		Task<bool> isExistAsync(string userId, string key);
	}
}
