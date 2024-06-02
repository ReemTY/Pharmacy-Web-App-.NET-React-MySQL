using Microsoft.AspNetCore.Mvc;
using AIproject.Models;
using AIproject.Services;
using AIproject.Data;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace AIproject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;

        public AdminController(IUserService userService, IAdminService adminService, ApplicationDbContext context)
        {
            _adminService = adminService;
            _userService = userService;
            _context = context;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp(UserDto UserDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Set IsAdmin to true
            else { UserDto.userRole = 1; };

            var result = await _adminService.Signup(UserDto);
            if (result.Success)
                return Ok(new { message = "Admin signed up successfully" });
            else
                return BadRequest(new { message = result.Message });
        }

        [HttpPost("create-user")]
        public async Task<ActionResult<User>> PostUser(UserDto userDto)
        {
            try
            {
                // Call the Signup method from the UserService
                var signupResult = await _userService.Signup(userDto);

                if (signupResult.Success)
                {
                    // User signed up successfully, return the created user
                    return CreatedAtAction(nameof(GetUserById), new { id = signupResult.Data }, userDto);
                }
                else
                {
                    // Signup failed, return a bad request with the error message
                    return BadRequest(new { message = signupResult.Message });
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions and return an appropriate error response
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.SearchHistory)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return NotFound();
                }

                return user;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // PUT: api/admin/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UpdateUserDto updateUserDto)
        {
            try
            {
                var existingUser = await _context.Users.FindAsync(id);
                if (existingUser == null)
                {
                    return NotFound();
                }

                // Update only the fields that are present in the updateUserDto object
                if (updateUserDto.Username != null)
                {
                    existingUser.Username = updateUserDto.Username;
                }

                if (updateUserDto.Email != null)
                {
                    existingUser.Email = updateUserDto.Email;
                }

                if (updateUserDto.PasswordHash != null)
                {
                    existingUser.PasswordHash = updateUserDto.PasswordHash;
                }

                // Update other fields as needed

                _context.Entry(existingUser).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok("User updated successfully");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        // DELETE: api/medicine/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound();
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok("user deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("requested-medicines")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllRequestedMedicinesWithUserIds()
        {
            try
            {
                var requestedMedicinesWithUserIds = await _context.RequestedMedicines
                    .Select(rm => new
                    {
                        MedicineName = rm.medicine,
                        UserId = rm.UserId,
                        status = rm.status,
                        Id = rm.Id
                    })
                    .ToListAsync();

                return requestedMedicinesWithUserIds;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("requested-medicines/approve{id}")]
        public async Task<IActionResult> ApproveRequestedMedicine(int id)
        {
            try
            {
                // Find the requested medicine by its unique identifier
                var requestedMedicine = await _context.RequestedMedicines.FirstOrDefaultAsync(rm => rm.Id == id);
                if (requestedMedicine == null)
                {
                    return NotFound("Requested medicine not found");
                }

                // Update the status to "Approved"
                requestedMedicine.status = "Approved";

                // Save changes to the database
                await _context.SaveChangesAsync();

                return Ok("Requested medicine status updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("requested-medicines/decline{id}")]
        public async Task<IActionResult> DeclineRequestedMedicine(int id)
        {
            try
            {
                // Find the requested medicine by its unique identifier
                var requestedMedicine = await _context.RequestedMedicines.FirstOrDefaultAsync(rm => rm.Id == id);
                if (requestedMedicine == null)
                {
                    return NotFound("Requested medicine not found");
                }

                // Update the status to "declined"
                requestedMedicine.status = "Declined";

                // Save changes to the database
                await _context.SaveChangesAsync();

                return Ok("Requested medicine status updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }
}
