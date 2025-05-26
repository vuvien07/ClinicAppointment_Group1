
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;

namespace ClinicAppointmentServer.Services.Implements
{
	public class GeminiService : IGeminiService
	{
		private readonly IConfiguration _configuration;

		public GeminiService(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		public async Task<string> askGeminiAsync(string propmt)
		{
			var geminiAPIKey = _configuration["Gemini:Api_Key"];
			var requestUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={geminiAPIKey}";
			var httpClient = new HttpClient();

			var internalContext = new[]
			{
	new { text = "Ví dụ định dạng thông tin đầy đủ của người dùng:" },
	new { text = "Tên: Viên Thanh Vuuu" },
	new { text = "Ngày sinh: 01/01/1990" },
	new { text = "Số điện thoại: 0901234567" },
	new { text = "Địa chỉ: 123 Lê Lợi, Hà Nội" },
	new { text = "Quốc tịch: Việt Nam" },
	new { text = "Phòng khám: 123, Hà Nội" },
	new { text = "Lí do khám: Viêm phòng mạch mạch" },
	new { text = "Dân tộc: Tày" },
	new { text = "Căn cước công dân: 020203001270" },
	new { text = "Nghề nghiệp: Công chức" },
	new { text = "Ghi chú: Nếu một trường bị thiếu hoặc không rõ ràng, hãy liệt kê tên các trường bị thiếu." }
};

			var requestData = new
			{
				contents = new[]
				{
		new
		{
			parts = internalContext
				.Select(example => new { text = example.text })
				.Append(new
				{
					text = $"Trích xuất thông tin người dùng từ văn bản sau:\n{propmt}\n\n" +
						   "Yêu cầu định dạng:\n" +
						   "- Tên:\n" +
						   "- Ngày sinh:\n" +
						   "- Số điện thoại:\n" +
						   "- Địa chỉ:\n" +
						   "- Quốc tịch:\n" +
						   "- Phòng khám:\n" +
						   "- Lí do khám:\n" +
						   "- Dân tộc:\n" +
						   "- Căn cước công dân:\n" +
						   "- Nghề nghiệp:\n\n" +
						   "Chỉ sử dụng văn bản này để trích xuất thông tin. " +
						   "Chỉ hiển thị thông tin được cung cấp trong văn bản không kèm chú thích, nếu không có thì không hiển thị" +
						   "Nếu thông tin đầy đủ, hãy trả lời: \"Thông tin đã được nhập đầy đủ.\" " +
						   "Nếu thiếu, hãy liệt kê các trường bị thiếu và đề xuất giá trị nếu có thể."
				})
				.ToArray()
		}
	}
			};

			var json = JsonConvert.SerializeObject(requestData);
			var content = new StringContent(json, Encoding.UTF8, "application/json");

			var response = await httpClient.PostAsync(requestUrl, content);
			var responseBody = await response.Content.ReadAsStringAsync();

			// Trích text từ response
			var parsed = JObject.Parse(responseBody);
			var result = parsed["candidates"]?[0]?["content"]?["parts"]?[0]?["text"]?.ToString();

			return result ?? "[Không có phản hồi từ Gemini]";
		}
	}
}
