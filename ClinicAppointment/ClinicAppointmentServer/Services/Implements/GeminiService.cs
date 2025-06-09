
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

			var internalContext = """
Ví dụ định dạng đầu ra khi văn bản chỉ chứa một phần thông tin:

Văn bản người dùng:
"Tôi tên là Viên Thanh Vũ."

Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Tên: Viên Thanh Vũ

Văn bản người dùng:
"Tôi tên là Viên Thanh Vũ, sinh ngày 01/01/1990 và làm nghề công chức."

Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Tên: Viên Thanh Vũ
Ngày sinh: 01/01/1990
Nghề nghiệp: Công chức

Ví dụ định dạng đầu ra khi văn bản không cung cấp thông tin nào:
Không có thông tin nào được cung cấp , vui lồng trích xuất thống thái ngôn ngữ trên văn bản.
""";

			var userPrompt = $@"""
Trích xuất thông tin người dùng từ văn bản sau:

{propmt}

Yêu cầu:
- Chỉ sử dụng đúng nội dung trong văn bản để trích xuất thông tin.
- Nếu trong văn bản chỉ có một phần thông tin, chỉ hiển thị phần đó theo đúng định dạng dưới đây.
- Không thêm hoặc suy diễn thông tin không có trong văn bản.
- Kết quả định dạng như sau:

Dưới đây là thông tin bạn đã cung cấp:
[Tên:]
[Ngày sinh:]
[Số điện thoại:]
[Địa chỉ:]
[Quốc tịch:]
[Phòng khám:]
[Lí do khám:]
[Dân tộc:]
[Căn cước công dân:]
[Nghề nghiệp:]

(Lưu ý: Chỉ hiển thị các dòng có thông tin tương ứng.)

Nếu tất cả các trường đều đã có trong văn bản, hãy trả lời:
Thông tin đã được nhập đầy đủ.

Nếu trường hợp người dùng không cung cấp thông tin nào, hãy trả lời: Không có thông tin nào được cung cấp.
Lưu ý: các thông tin như ngày sinh nên chuyển về đúng định dạng dd/mm/yyyy, số điện thoại và căn cước nên được chuyển đổi về số

Nếu thiếu trường nào, hãy liệt kê trường bị thiếu và đề xuất giá trị nếu có thể.
""";


			var requestData = new
			{
				contents = new[]
				{
		new
		{
			  parts = new[]
			{
				new { text = internalContext + userPrompt }
			}
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
