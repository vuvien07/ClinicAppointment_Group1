using ClinicAppointmentServer.Repositories.Implements;
using ClinicAppointmentServer.Repositories;
using Microsoft.EntityFrameworkCore;
using ClinicAppointmentServer.Entiies;
using ClinicAppointmentServer.Services;
using ClinicAppointmentServer.Services.Implements;
using ClinicAppointmentServer.Middlewares;
using StackExchange.Redis;
using ClinicAppointmentServer.Proxy;

namespace ClinicAppointmentServer
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);
			ConfigureServices(builder.Services);
			//builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
			//{
			//	var configuration = builder.Configuration.GetSection("Redis")["ConnectionString"];
			//	return ConnectionMultiplexer.Connect(configuration);
			//});
			builder.Services.AddAuthorization();
			builder.Services.AddHttpClient();
			var app = builder.Build();
			app.UseMiddleware<ExceptionHandlerMiddleware>();
			app.UseCors("AllowAll");
			app.UseAuthentication();
			app.UseAuthorization();
			app.UseStaticFiles();
			app.UseHttpsRedirection();
			app.MapControllers();
			app.Run();
		}
		public static void ConfigureServices(IServiceCollection services)
		{
			services.AddControllers()
				.ConfigureApiBehaviorOptions(
				options => options.SuppressModelStateInvalidFilter = true
				)
				.AddJsonOptions(options => options.JsonSerializerOptions.PropertyNameCaseInsensitive = true);
			services.AddDbContext<ClinicAppointmentContext>(options => options.UseSqlServer("Name=ConnectionStrings:DBContext"));
			services.AddCors(options =>
			{
				options.AddPolicy("AllowAll",
					builder =>
					{
						builder.AllowAnyOrigin()
							   .AllowAnyMethod()
							   .AllowAnyHeader();
					});
			});
			services.AddScoped(typeof(ClinicAppointmentContext));
			services.AddTransient<ILoginService, LoginService>();
			//services.AddScoped<IConversationService, ConversationService>();
			services.AddTransient<IGeminiService, GeminiService>();
			services.AddTransient<IClinicInfoService, ClinicInfoService>();
			services.AddTransient<IClinicRepository, ClinicRepository>();
			services.AddTransient<IClinicInfoRepository, ClinicInfoReporitory>();
			services.AddTransient<IAccountRepository, AccountRepository>();
			services.AddTransient<IBookClinicService, BookClinicService>();
			services.AddTransient<IPlanScheduleRepository, PlanScheduleRepository>();
			services.AddTransient<IPatientRepository, PatientRepository>();
			services.AddTransient<IElectronicDiseaseRepository, ElectronicDiseaseRepository>();
			services.AddTransient<IPatientService, PatientService>();
			services.AddTransient<IJwtService, JwtService>();
		}
	}
}
