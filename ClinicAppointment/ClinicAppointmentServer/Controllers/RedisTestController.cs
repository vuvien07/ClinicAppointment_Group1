using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace ClinicAppointmentServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RedisTestController : ControllerBase
    {
        private readonly IDatabase _db;

		public RedisTestController(IConnectionMultiplexer connectionMultiplexer)
		{
			_db = connectionMultiplexer.GetDatabase();
		}
		[HttpGet("set")]
		public async Task<IActionResult> SetAsync(string key, string value)
		{
			await _db.StringSetAsync(key, value);
			return Ok($"Set {key} = {value}");
		}

		[HttpGet("get")]
		public async Task<IActionResult> GetAsync(string key)
		{
			var value = await _db.StringGetAsync(key);
			return Ok(value.HasValue ? value.ToString() : "(not found)");
		}
	}
}
