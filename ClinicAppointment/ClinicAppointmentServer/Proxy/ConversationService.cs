using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Mono.TextTemplating;
using StackExchange.Redis;
using System.Text.Json;

namespace ClinicAppointmentServer.Proxy
{
	public class ConversationService : IConversationService
	{
		private readonly IDatabase _db;
		public ConversationService(IConnectionMultiplexer redis)
		{
			_db = redis.GetDatabase();
		}

		public async Task<ConversationState> GetOrCreateAsync(string userId)
		{
			var redisValue = await _db.StringGetAsync(userId);
			ConversationState conversationState;
			if (redisValue.IsNullOrEmpty)
			{
				conversationState = new ConversationState();
			}
			else
			{
				conversationState = JsonSerializer.Deserialize<ConversationState>(redisValue) ?? new ConversationState();
			}
			return conversationState;
		}

		public async Task<bool> isExistAsync(string userId, string key)
		{
			var redisValue = await _db.StringGetAsync(userId);
			ConversationState conversationState;
			if (redisValue.IsNullOrEmpty)
			{
				return false;
			}
			else
			{
				conversationState = JsonSerializer.Deserialize<ConversationState>(redisValue) ?? new ConversationState();
				return conversationState.Info.ContainsKey(key);
			}
		}

		public async Task ResetAsync(string userId)
		{
			await _db.KeyDeleteAsync(userId);
		}

		public async Task SaveAsync(string userId, ConversationState state)
		{
			var json = JsonSerializer.Serialize(state);
			await _db.StringSetAsync(userId, json);
		}
	}
}
