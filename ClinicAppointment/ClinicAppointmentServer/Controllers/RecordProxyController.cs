using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text.Json;

namespace ClinicAppointmentServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordProxyController : ControllerBase
    {
		private readonly HttpClient _httpClient;

		public RecordProxyController(IHttpClientFactory httpClientFactory)
		{
			_httpClient = httpClientFactory.CreateClient();
		}

		[HttpGet("mp3")]
		public async Task<IActionResult> GetMp3([FromQuery] string url)
		{
			if (string.IsNullOrEmpty(url))
				return BadRequest("Missing url");

			try
			{
				var response = await _httpClient.GetAsync(url);
				if (!response.IsSuccessStatusCode)
					return StatusCode((int)response.StatusCode, "Failed to fetch mp3");

				var content = await response.Content.ReadAsStreamAsync();
				return File(content, "audio/mpeg");
			}
			catch (Exception ex)
			{
				Console.WriteLine("Lỗi proxy: " + ex.Message);
				return StatusCode(500, "Lỗi proxy");
			}
		}

		[HttpGet("proxyCall")]
		public async Task<IActionResult> ProxyCall()
		{
			var handler = new HttpClientHandler
			{
				ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
			};
			using var client = new HttpClient(handler);
			var request = new HttpRequestMessage(HttpMethod.Get, "https://a1.casclinic.online/getCallLog");
			request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", "your_token_here");
			var response = await client.SendAsync(request);

			if (!response.IsSuccessStatusCode)
			{
				return StatusCode((int)response.StatusCode, "Failed to fetch mp3");
			}

			var content = await response.Content.ReadAsStringAsync();
			dynamic data = JsonSerializer.Deserialize<dynamic>(content)?? new { };
			return Ok(data);
		}
	}
}
