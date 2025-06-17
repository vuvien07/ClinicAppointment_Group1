using ClinicAppointmentServer.Entiies;
using ClinicAppointmentServer.Repositories;
using ClinicAppointmentServer.Utils;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.RegularExpressions;

namespace ClinicAppointmentServer.Proxy
{
	public class GeminiService : IGeminiService
	{
		private readonly IConfiguration _configuration;
		private readonly IConversationService _conversationService;
		private readonly IClinicRepository _clinicRepository;

		public GeminiService(IConfiguration configuration, IConversationService conversationService, IClinicRepository clinicRepository)
		{
			_configuration = configuration;
			_conversationService = conversationService;
			_clinicRepository = clinicRepository;
		}

		public async Task<string> askGeminiAsync(string userId, string propmt)
		{
			var geminiAPIKey = _configuration["Gemini:Api_Key"];
			var requestUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={geminiAPIKey}";
			var httpClient = new HttpClient();
			string targerField = await GetFirstNullOrEmptyValueKey(userId);

			var internalContext = $"""
Bạn là một hệ thống trích xuất thông tin từ văn bản người dùng. Dưới đây là các ví dụ để bạn hiểu cách xử lý:

==============================
1. CÁC VÍ DỤ ĐẦU VÀO / ĐẦU RA
==============================

--- Tên ---
Văn bản người dùng:
"Tôi tên là Viên Thanh Vũ."
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Tên: Viên Thanh Vũ

Văn bản người dùng:
"Tên Viên Thanh Vũ."
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Tên: Viên Thanh Vũ

--- Ngày sinh ---
Văn bản người dùng:
"Ngày sinh là một tháng một năm một chín chín không"
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Ngày sinh: 01/01/1990

Văn bản người dùng:
"Ngày sinh của tôi là một tháng một năm một chín chín không"
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Ngày sinh: 01/01/1990

-- Giới tính --
Văn bản người dùng:
"Giới tính của tôi là nam"
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Giới tính: Nam
Văn bản người dùng:
"Giới tính của tôi là nam"
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Giới tính: Nam
Văn bản người dùng:
"Giới tính là nam"
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Giới tính: Nam

--- Số điện thoại ---
Văn bản người dùng:
"Số điện thoại của tôi là không một hai ba bốn."
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Số điện thoại: 01234

--- Căn cước công dân ---
Văn bản người dùng:
"Căn cước là không một hai ba bốn."
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Căn cước công dân: 01234

--- Địa chỉ ---
Văn bản người dùng:
"Địa chỉ của tôi là Lạng sơn"
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Địa chỉ: Lạng sơn

Văn bản người dùng:
"Địa chỉ của tôi ở Lạng sơn"
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Địa chỉ: Lạng sơn

--- Nghề nghiệp ---
Văn bản người dùng:
"Tôi làm công chức"
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Nghề nghiệp: Công chức

Văn bản người dùng:
"Nghề nghiệp tôi là công chức"
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Nghề nghiệp: Công chức

-- Lí do khám ---
Văn bản người dùng:
"Lí do khám là bị đau bụng"
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Lí do khám: Đau bụng
Văn bản người dùng:
"Lí do khám là bị đau xương khớp"
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Lí do khám: Đau xương khớp
Văn bản người dùng:
"Tôi có biểu hiện bị đau bụng"
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Lí do khám: Đau bụng

--- Nghề nghiệp ---
Văn bản người dùng:
"Nghề nghiệp tôi là công chức"
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Nghề nghiệp: Công chức

Văn bản người dùng:
"Nghề nghiệp là công chức"
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Nghề nghiệp: Công chức

--- Trích xuất nhiều trường ---
Văn bản người dùng:
"Tôi tên là Viên Thanh Vũ. Ngày sinh là một tháng một năm một chín chín không. Tôi làm công chức."
Kết quả trích xuất:
Dưới đây là thông tin bạn đã cung cấp:
Tên: Viên Thanh Vũ  
Ngày sinh: 01/01/1990  
Nghề nghiệp: Công chức


==============================
2. XỬ LÝ KHI KHÔNG CÓ THÔNG TIN
==============================

Nếu văn bản không có thông tin hoặc không có từ khóa liên quan đến trường {targerField.ToLower()}, hãy trả lời như sau:

Bạn không cung cấp thông tin hoặc thông tin không chính xác về {targerField.ToLower()} cho chúng tôi.

==============================
3. TỪ KHÓA GỢI Ý THEO TRƯỜNG
==============================

- **Tên**: "tên tôi là", "tôi tên là", "em tên", "chị tên", "anh tên", "mình tên", "tên"
- **Ngày sinh**: "ngày sinh", "sinh ngày", "tôi sinh", "sinh vào", "sinh ra"
- **Số điện thoại**: "số điện thoại", "điện thoại", "sdt", "số máy", "liên hệ"
- **Căn cước công dân**: "căn cước", "số cccd", "cccd", "cmnd", "chứng minh", "số định danh"
- **Địa chỉ**: "địa chỉ", "tôi ở", "sống tại", "nhà ở", "nơi ở"
- **Nghề nghiệp**: "tôi làm", "nghề nghiệp", "nghề", "công việc", "làm nghề"
- **Dân tộc**: "dân tộc", "người Kinh", "người Tày", "thuộc dân tộc"
- **Quốc tịch**: "quốc tịch", "tôi là người", "tôi mang quốc tịch"
- **Phòng khám**: "phòng khám", "bệnh viện", "trung tâm y tế", "khám ở"
- **Lý do khám**: "tôi bị", "khám vì", "lý do khám", "triệu chứng", "bị"

==============================
4. 🏥 TRẢ LỜI KHI NGƯỜI DÙNG HỎI VỀ CÁC PHÒNG KHÁM
==============================

Nếu người dùng hỏi:
- "Có những phòng khám nào?"
- "Danh sách các phòng khám?"
- "Tôi có thể khám ở đâu?"
- "Cho tôi biết các phòng khám bạn hỗ trợ"

Thì hệ thống phải trả lời một danh sách các phòng khám như sau:

Dưới đây là các phòng khám bạn có thể lựa chọn:
{await GetClinicList()}
""";

			var userPrompt = $@"""
Trích xuất thông tin người dùng từ văn bản sau:

{propmt}

Yêu cầu:
- Chỉ sử dụng thông tin có trong văn bản, không thêm hoặc suy diễn.
- Chỉ hiển thị những dòng có thông tin tương ứng, theo định dạng sau:
  Dưới đây là thông tin bạn đã cung cấp:
  Tên: [giá trị]
  Ngày sinh: [dd/mm/yyyy]
  Số điện thoại: [giá trị]
  Địa chỉ: [giá trị]
  Quốc tịch: [giá trị]
  Phòng khám: [giá trị]
  Lí do khám: [giá trị]
  Dân tộc: [giá trị]
  Căn cước công dân: [giá trị]
  Nghề nghiệp: [giá trị]

- Nếu tất cả thông tin đã có đầy đủ, trả lời:
  Thông tin đã được nhập đầy đủ.

- Nếu người dùng **không cung cấp hoặc thông tin không chứa từ khóa** về {targerField}, trả lời:
  Bạn không cung cấp thông tin hoặc thông tin không chính xác về {targerField.ToLower()} cho chúng tôi.

Lưu ý:
- Ngày sinh phải được chuyển về định dạng dd/mm/yyyy nếu có thể.
- Các số như điện thoại, căn cước công dân cần được chuẩn hóa thành số.
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
			result = await AppendToResult(result, userId, targerField);
			return result ?? "[Không có phản hồi từ Gemini]";
		}

		private async Task<string> AppendToResult(string? result, string? userId, string? targerField)
		{
			if (result == null)
			{
				return "[Không có phản hồi từ Gemini]";
			}
			StringBuilder sb = new StringBuilder(result);
			ConversationState conversationState = await _conversationService.GetOrCreateAsync(userId);
			var value = GetValueFromResult(result);
			if (result.Contains(targerField) == false)
			{
				sb.Append($" Bạn vui lòng cung cấp hoặc nói chính xác hơn về " + targerField.ToLower() + " của bạn được không?");
				return sb.ToString();
			}
			if (targerField.Equals("Ngày sinh") && UtilHelper.TryParseDateOnlyFromString(value, out _) == false)
			{
				sb.Append(" .Thông tin ngày sinh chưa chính xác. Bạn vui lòng cung cấp hoặc nói chính xác hơn về " + targerField.ToLower() + " của bạn được không?");
				return sb.ToString();
			}
			if (targerField.Equals("Giới tính") && !value.Contains("Nam") && !value.Contains("Nữ"))
			{
				sb.Append(" .Thông tin giới tính chưa chính xác. Bạn vui lòng cung cấp hoặc nói chính xác hơn về " + targerField.ToLower() + " của bạn được không?");
				return sb.ToString();
			}
			if (targerField.Equals("Số điện thoại") && !System.Text.RegularExpressions.Regex.IsMatch(value, @"^0\d{9}$"))
			{
				sb.Append(" .Thông tin số điện thoại chưa chính xác. Bạn vui lòng cung cấp hoặc nói chính xác hơn về " + targerField.ToLower() + " của bạn được không?");
				return sb.ToString();
			}
			if (targerField.Equals("Căn cước công dân") && !System.Text.RegularExpressions.Regex.IsMatch(value, @"^0\d{12}$"))
			{
				sb.Append(" .Thông tin số căn cước công dân chưa chính xác. Bạn vui lòng cung cấp hoặc nói chính xác hơn về " + targerField.ToLower() + " của bạn được không?");
				return sb.ToString();
			}
			await SaveTargetValueToRedis(userId, targerField, result);
			string nextTargerField = await GetFirstNullOrEmptyValueKey(userId);
			if (!string.IsNullOrEmpty(nextTargerField))
				sb.Append($". Cảm ơn bạn. Bạn có thể cung cấp thông tin về " + nextTargerField.ToLower() + " của bạn được không?");
			else sb.Append(". Thông tin bạn cung cấp đã đầy đủ. Cảm ơn bạn đã sử dụng dịch vụ này của chúng tôi. Chúc bạn một ngày tốt lành.");
			return sb.ToString();
		}

		private async Task SaveTargetValueToRedis(string? userId, string? key, string? result)
		{
			if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(key) || string.IsNullOrEmpty(result) || string.IsNullOrEmpty(result.Trim())) return;
			ConversationState conversationState = await _conversationService.GetOrCreateAsync(userId);
			string[] resArr = result.Split('\n');
			for (int i = 0; i < resArr.Length; i++)
			{
				string[] arr = resArr[i].Split(':');
				if (arr.Length == 2)
				{
					conversationState.Info[key] = arr[1].Trim();
				}
			}
			await _conversationService.SaveAsync(userId, conversationState);

		}

		private string GetValueFromResult(string? result)
		{
			if (result == null) return "";
			string[] resArr = result.Split('\n');
			var value = "";
			for (int i = 0; i < resArr.Length; i++)
			{
				string[] arr = resArr[i].Split(':');
				if (arr.Length == 2)
				{
					value = arr[1].Trim();
				}
			}
			return value;
		}

		private async Task<string> GetFirstNullOrEmptyValueKey(string userId)
		{
			string key = "";
			ConversationState conversationState = await _conversationService.GetOrCreateAsync(userId);
			if (!conversationState.Info.ContainsKey("Tên"))
			{
				key = "Tên";
				return key;
			}
			if (!conversationState.Info.ContainsKey("Ngày sinh"))
			{
				key = "Ngày sinh";
				return key;
			}
			if (!conversationState.Info.ContainsKey("Giới tính"))
			{
				key = "Giới tính";
				return key;
			}
			if (!conversationState.Info.ContainsKey("Số điện thoại"))
			{
				key = "Số điện thoại";
				return key;
			}
			if (!conversationState.Info.ContainsKey("Địa chỉ"))
			{
				key = "Địa chỉ";
				return key;
			}
			if (!conversationState.Info.ContainsKey("Quốc tịch"))
			{
				key = "Quốc tịch";
				return key;
			}
			//if (!conversationState.Info.ContainsKey("Phòng khám"))
			//{
			//	key = "Phòng khám";
			//	return key;
			//}
			if (!conversationState.Info.ContainsKey("Dân tộc"))
			{
				key = "Dân tộc";
				return key;
			}
			if (!conversationState.Info.ContainsKey("Căn cước công dân"))
			{
				key = "Căn cước công dân";
				return key;
			}
			if (!conversationState.Info.ContainsKey("Nghề nghiệp"))
			{
				key = "Nghề nghiệp";
				return key;
			}
			if (!conversationState.Info.ContainsKey("Lí do khám"))
			{
				key = "Lí do khám";
				return key;
			}
			return "";
		}

		private async Task<string> GetClinicList()
		{
			List<PhongKham> phongKhams = await _clinicRepository.GetAllClinic();
			StringBuilder sb = new StringBuilder();
			phongKhams.ForEach((phongKham) =>
			{
				sb.AppendLine($"{phongKham.PhongKhamId}. {phongKham.TenPhong}");
			});
			return sb.ToString();
		}
	}
}
