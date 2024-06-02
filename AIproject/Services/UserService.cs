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
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly string _jwtSecret;

        public UserService(ApplicationDbContext context, string jwtSecret)
        {
            _context = context;
            _jwtSecret = jwtSecret;
        }

        public async Task<ServiceResponse<string>> Signup(UserDto userDto)
        {
            var serviceResponse = new ServiceResponse<string>();
            try
            {
                /*
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
                if (existingUser != null)
                {
                    serviceResponse.Success = false;
                    serviceResponse.Message = "Email already exists.";
                    return serviceResponse;
                }*/

                var newUser = new User
                {
                    Username = userDto.Username,
                    Email = userDto.Email,
                    PasswordHash = HashPassword(userDto.Password),
                    SearchHistory = null,
                    RequestedMedicines = null,
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                serviceResponse.Data = GenerateJwtToken(newUser);
                serviceResponse.Message = "User signed up successfully";
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<(string Token, int UserRole)>> Login(LoginDto loginDto)
        {
            var serviceResponse = new ServiceResponse<(string Token, int UserRole)>();
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
                if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
                {
                    serviceResponse.Success = false;
                    serviceResponse.Message = "Invalid email or password.";
                    return serviceResponse;
                }

                // Retrieve the user role from the database
                var userRole = user.userRole; // Assuming userRole is a property of the User model

                // Generate JWT token
                var token = GenerateJwtToken(user);

                serviceResponse.Data = (Token: token, UserRole: userRole);
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


        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username)
                    // You can add more claims as needed (e.g., roles, permissions)
                }),
                Expires = DateTime.UtcNow.AddDays(7), // Token expiration time
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


        public async Task<ServiceResponse<string>> GetUserByUsername(string username)
        {
            var response = new ServiceResponse<string>();
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
                if (user != null)
                {
                    response.Data = user.Id.ToString(); // Assuming you want to return the user's ID as a string
                    response.Success = true;
                    response.Message = "User found.";
                }
                else
                {
                    response.Success = false;
                    response.Message = "User not found.";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<string>> GetUserByEmail(string email)
        {
            var response = new ServiceResponse<string>();
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user != null)
                {
                    response.Data = user.Id.ToString(); // Assuming you want to return the user's ID as a string
                    response.Success = true;
                    response.Message = "User found.";
                }
                else
                {
                    response.Success = false;
                    response.Message = "User not found.";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }
        public async Task<ServiceResponse<string>> GetUserById(int id)
        {
            var response = new ServiceResponse<string>();
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (user != null)
                {
                    response.Data = user.Username.ToString(); // Assuming you want to return the user's ID as a string
                    response.Success = true;
                    response.Message = "User found.";
                }
                else
                {
                    response.Success = false;
                    response.Message = "User not found.";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }
    }
}