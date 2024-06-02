using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using AIproject.Data;
using AIproject.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace AIproject
{
    public class Startup
    {
        // Inject IConfiguration into the Startup class
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Configure the database context using MySQL
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseMySql(
                    Configuration.GetConnectionString("DefaultConnection"),
                    new MySqlServerVersion(new Version(8, 0, 28)) // Specify the MySQL server version
                )
            );

            // Register the UserService implementation
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<SearchHistoryService>();

            // Retrieve jwtSecret from configuration
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
            string jwtSecret = Configuration["JwtSecret"];
#pragma warning restore CS8600 // Converting null literal or possible null value to non-nullable type.

            // Check if jwtSecret is null or empty
            if (string.IsNullOrEmpty(jwtSecret))
            {
                throw new ApplicationException("JwtSecret is missing or empty in the configuration.");
            }

            // Add jwtSecret to the DI container
            services.AddSingleton(jwtSecret);

            
            // Add CORS policy
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                               .AllowAnyHeader()
                               .AllowAnyMethod();
                    });
            });



            // Add controllers and related services
            services.AddControllers();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // Use CORS middleware
            app.UseCors("AllowAllOrigins");

            // Use routing middleware
            app.UseRouting();

            // Use authentication middleware
            app.UseAuthentication();

            // Use authorization middleware
            app.UseAuthorization();

            // Handle requests
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers(); // Map controller routes
            });
        }

    }
}
