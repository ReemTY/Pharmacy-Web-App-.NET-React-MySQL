using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AIproject.Models;
using System.Security.Cryptography;
using AIproject.Data;
using Org.BouncyCastle.Crypto.Generators;

namespace AIproject.Services
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;
        private readonly string _jwtSecret;

        public AdminService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<string>> Signup(UserDto userDto)
        {
            var serviceResponse = new ServiceResponse<string>();
            try
            {
                var existingAdmin = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
                if (existingAdmin != null)
                {
                    serviceResponse.Success = false;
                    serviceResponse.Message = "Email already exists.";
                    return serviceResponse;
                }

                var newAdmin = new User
                {
                    Username = userDto.Username,
                    Email = userDto.Email,
                    PasswordHash = HashPassword(userDto.Password),
                    userRole = userDto.userRole
                };

                _context.Users.Add(newAdmin);
                await _context.SaveChangesAsync();

                serviceResponse.Message = "User signed up successfully";
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<string>> Login(LoginDto loginDto)
        {
            var serviceResponse = new ServiceResponse<string>();
            try
            {
                var admin = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
                if (admin == null || !VerifyPassword(loginDto.Password, admin.PasswordHash))
                {
                    serviceResponse.Success = false;
                    serviceResponse.Message = "Invalid email or password.";
                    return serviceResponse;
                }

                serviceResponse.Message = "User logged in successfully";
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "An error occurred during login."; // Avoid exposing sensitive information
            }
            return serviceResponse;
        }
        private string HashPassword(string password)
        {
            // Install BCrypt.Net package using NuGet
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private bool VerifyPassword(string password, string passwordHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, passwordHash);
        }

    }
}