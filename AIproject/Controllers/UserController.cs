using Microsoft.AspNetCore.Mvc;
using AIproject.Models;
using AIproject.Services;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using AIproject.Utilities;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication;
using AIproject.Data;
using Microsoft.EntityFrameworkCore;


namespace AIproject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;
        IAuthenticationService authenticationService;

        public UserController(ApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp(UserDto userDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check if the username already exists
            var existingUsernameResponse = await _userService.GetUserByUsername(userDto.Username);
            if (existingUsernameResponse.Success)
            {
                return BadRequest(new { message = "Username already exists." });
            }

            // Check if the email already exists
            var existingEmailResponse = await _userService.GetUserByEmail(userDto.Email);
            if (existingEmailResponse.Success)
            {
                return BadRequest(new { message = "Email already exists." });
            }

            // Set IsAdmin to false
            userDto.userRole = 0;


            // If both username and email are unique, proceed with signup
            var result = await _userService.Signup(userDto);
            if (result.Success)
                return Ok(new { message = "User signed up successfully" });
            else
                return BadRequest(new { message = result.Message });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var result = await _userService.Login(loginDto);
            if (result.Success)
            {
                var token = result.Data.Token;
                var userRole = result.Data.UserRole;

                return Ok(new { message = "User logged in successfully", token, userRole });
            }
            else
            {
                return Unauthorized(new { message = result.Message });
            }
        }



        [HttpPost("logout")]
        public IActionResult Logout()
        {
            try
            {

                // For demonstration, let's clear it from session storage
                HttpContext.Session.Remove("token");
                return Ok(new { message = "User logged out successfully" });
            }
            catch (Exception ex)
            {
                // Handle any exceptions
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        public ActionResult<IEnumerable<User>> GetUsers(string name = null)
        {
            IQueryable<User> query = _context.Users;

            query = query.Include(u => u.SearchHistory);
            query = query.Include(u => u.RequestedMedicines);

            // Apply filtering if a name is provided
            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(m => m.Username.Contains(name));
            }

            // Execute the query and return the results
            return query.ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            try
            {
                // Query the database for the user with the provided ID
                var user = await _context.Users
                    .Include(u => u.SearchHistory)
                    .Include(u => u.RequestedMedicines)
                    .FirstOrDefaultAsync(u => u.Id == id);

                // Check if the user was found
                if (user == null)
                {
                    return NotFound();
                }
                user.PasswordHash = null;
                return user;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPost("{userId}/request-medicine")]
        public async Task<ActionResult<RequestedMedicines>> PostMedicineRequest(int userId, RequestedMedicines medicineRequest)
        {
            try
            {

                // Assign user ID to the medicine request
                medicineRequest.UserId = userId;

                // Set the timestamp to the current date and time in UTC format
                medicineRequest.Timestamp = DateTime.UtcNow;
                medicineRequest.status = "Pending";
                // Save the medicine request to the database
                _context.RequestedMedicines.Add(medicineRequest);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(PostMedicineRequest), new { id = medicineRequest.Id }, medicineRequest);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{userId}/requested-medicines")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllRequestedMedicinesWithUserIds(int userId)
        {
            try
            {
                var requestedMedicinesWithUserIds = await _context.RequestedMedicines
                    .Where(rm => rm.UserId == userId)
                    .Select(rm => new { MedicineName = rm.medicine})
                    .ToListAsync();

                return requestedMedicinesWithUserIds;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}