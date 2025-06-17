using System.Globalization;
using System.IdentityModel.Tokens.Jwt;

namespace ClinicAppointmentServer.Utils
{
	public static class UtilHelper
	{
		public static IDictionary<string, string> DecodeToken(string jwtToken)
		{
			var handler = new JwtSecurityTokenHandler();

			if (!handler.CanReadToken(jwtToken))
				throw new ArgumentException("Token không hợp lệ");

			var token = handler.ReadJwtToken(jwtToken);

			var claims = token.Claims.ToDictionary(c => c.Type, c => c.Value);

			return claims;
		}

		public static bool TryParseDateOnlyFromString(string input, out DateOnly result)
		{
			if (DateOnly.TryParseExact(input, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var dt))
			{
				result = dt;
				return true;
			}

			result = default;
			return false;
		}
	}
}
