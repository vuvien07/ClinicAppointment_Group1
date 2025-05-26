namespace ClinicAppointmentClient
{
    public class Program
    {
        public static void Main(string[] args)
        {
			var builder = WebApplication.CreateBuilder(args);
			builder.Services.AddControllersWithViews()
	.AddRazorRuntimeCompilation();
			var app = builder.Build();
			app.UseStaticFiles();
			app.UseRouting();
			app.MapControllerRoute(
	name: "default",
	pattern: "{controller=Login}/{action=Index}");
			app.Run();
		}
    }
}
