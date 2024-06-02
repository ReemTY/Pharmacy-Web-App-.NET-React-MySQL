using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using AIproject.Models;
using AIproject.Data;
using AIproject.Services;
using System.Security.Claims;

namespace AIproject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicineController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly SearchHistoryService _searchHistoryService;

        public MedicineController(ApplicationDbContext context, SearchHistoryService searchHistoryService)
        {
            _context = context;
            _searchHistoryService = searchHistoryService;
        }

        // POST: api/medicine
        [HttpPost]
        public async Task<ActionResult<Medicine>> PostMedicine(Medicine medicine)
        {
            try
            {
                // Check if a medicine with the same name already exists
                var existingMedicine = await _context.Medicine.FirstOrDefaultAsync(m => m.Name == medicine.Name);
                if (existingMedicine != null)
                {
                    // Medicine with the same name already exists, return a conflict response
                    return Conflict($"Medicine with name '{medicine.Name}' already exists.");
                }

                // Check if a medicine with the same ID already exists
                existingMedicine = await _context.Medicine.FindAsync(medicine.Id);
                if (existingMedicine != null)
                {
                    // Medicine with the same ID already exists, return a conflict response
                    return Conflict($"Medicine with ID '{medicine.Id}' already exists.");
                }

                // Add the new medicine to the database
                _context.Medicine.Add(medicine);
                await _context.SaveChangesAsync();

                // Return the created medicine
                return CreatedAtAction(nameof(GetMedicineById), new { id = medicine.Id }, medicine);
            }
            catch (Exception ex)
            {
                // Handle exceptions and return an appropriate error response
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        // GET: api/medicine
        [HttpGet]
        public ActionResult<IEnumerable<Medicine>> GetMedicines(string name = null)
        {
            IQueryable<Medicine> query = _context.Medicine;

            // Apply filtering if a name is provided
            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(m => m.Name.Contains(name));
            }

            // Execute the query and return the results
            return query.ToList();
        }

        // PUT: api/medicine/{id}
        [HttpPut("update/{id}")]
        public async Task<IActionResult> PutMedicine(int id, Medicine medicine)
        {
            try
            {
                // Check if the medicine with the provided id exists
                var existingMedicine = await _context.Medicine.FindAsync(id);
                if (existingMedicine == null)
                {
                    return NotFound("Medicine not found.");
                }

                // Update the medicine properties
                existingMedicine.Name = medicine.Name;
                existingMedicine.Description = medicine.Description;
                existingMedicine.Price = medicine.Price;
                existingMedicine.CategoryId = medicine.CategoryId; // Update category ID if needed

                // Update the medicine entity state
                _context.Entry(existingMedicine).State = EntityState.Modified;

                // Save changes
                await _context.SaveChangesAsync();

                // Return the updated medicine
                return Ok(existingMedicine);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MedicineExists(id))
                {
                    return NotFound("Medicine not found.");
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



        // DELETE: api/medicine/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicine(int id)
        {
            try
            {
                var medicine = await _context.Medicine.FindAsync(id);
                if (medicine == null)
                {
                    return NotFound();
                }

                _context.Medicine.Remove(medicine);
                await _context.SaveChangesAsync();

                return Ok("Medicine deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool MedicineExists(int id)
        {
            return _context.Medicine.Any(e => e.Id == id);
        }


        // GET: api/medicine/{id}
        [HttpGet("id/{id}")]
        public async Task<ActionResult<Medicine>> GetMedicineById(int id)
        {
            try
            {
                var Medicine = await _context.Medicine.FindAsync(id);

                if (Medicine == null)
                {
                    return NotFound();
                }

                return Medicine;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{userId}/{searchString}")]
        public async Task<ActionResult<IEnumerable<Medicine>>> GetMedicineBySearchString(int userId, string searchString)
        {
            try
            {

                var medicines = await _context.Medicine
                    .Where(m => m.Name.Contains(searchString))
                    .ToListAsync();

                if (medicines == null)
                {
                    return NotFound();
                }
                if (!medicines.Any())
                {
                    await _searchHistoryService.AddToSearchHistory(searchString, userId);
                    return NotFound();
                }
                // Call function to save search history with user ID
                await _searchHistoryService.AddToSearchHistory(searchString, userId);

                return medicines;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("{searchString}")]
        public async Task<ActionResult<IEnumerable<Medicine>>> GetMedicineBySearchString(string searchString)
        {
            try
            {
                var medicines = await _context.Medicine
                    .Where(m => m.Name.Contains(searchString))
                    .ToListAsync();

                if (!medicines.Any())
                {
                    return Ok(new List<Medicine>()); // Return an empty array if no results found
                }

                return medicines;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        


    }
}
