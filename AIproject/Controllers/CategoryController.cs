using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using AIproject.Models;
using AIproject.Data;

namespace AIproject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/medicine
        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            try
            {
                // Check if a category with the same name already exists
                var existingCategory = await _context.Categories.FirstOrDefaultAsync(c => c.Name == category.Name);
                if (existingCategory != null)
                {
                    return Conflict($"Category with name '{category.Name}' already exists.");
                }

                // Check if a category with the same ID already exists
                existingCategory = await _context.Categories.FindAsync(category.Id);
                if (existingCategory != null)
                {
                    return Conflict($"Category with ID '{category.Id}' already exists.");
                }

                // Add the category to the context
                _context.Categories.Add(category);

                // Add medicines associated with the category
                if (category.medicines != null && category.medicines.Any())
                {
                    foreach (var medicine in category.medicines)
                    {
                        // Check if a medicine with the same name already exists
                        var existingMedicine = await _context.Medicine.FirstOrDefaultAsync(m => m.Name == medicine.Name);
                        if (existingMedicine != null)
                        {
                            return Conflict($"Medicine with name '{medicine.Name}' already exists.");
                        }

                        // Set the CategoryId of the medicine to the ID of the newly created category
                        medicine.CategoryId = category.Id;

                        // Add the medicine to the context
                        _context.Medicine.Add(medicine);
                    }
                }

                // Save changes to add category and medicines to the database
                await _context.SaveChangesAsync();

                // Return the created category
                return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/medicine
        [HttpGet]
        public ActionResult<IEnumerable<Category>> GetCategories(string name = null)
        {
            IQueryable<Category> query = _context.Categories;

            // Apply filtering if a name is provided
            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(m => m.Name.Contains(name));
            }

            var categories = query.ToList();

            // Explicitly load related medicines for each category
            foreach (var category in categories)
            {
                _context.Entry(category).Collection(c => c.medicines).Load();
            }

            // Return the categories with loaded medicines
            return categories;
        }

        // GET: api/medicine/{id}
        [HttpGet("id/{id}")]
        public async Task<ActionResult<Category>> GetCategoryById(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);

                if (category == null)
                {
                    return NotFound();
                }

                return category;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{searchString}")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategoriesBySearchString(string searchString)
        {
            try
            {
                var categories = await _context.Categories
                    .Where(m => m.Name.Contains(searchString))
                    .ToListAsync();

                if (categories == null || !categories.Any())
                {
                    return NotFound();
                }

                return categories;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
[HttpGet("filter/{categoryId}")]
public async Task<ActionResult<IEnumerable<Medicine>>> GetMedicinesByCategory(int categoryId)
{
    try
    {
        var medicines = await _context.Medicine
            .Where(m => m.CategoryId == categoryId)
            .ToListAsync();

        if (medicines == null || medicines.Count == 0)
        {
            return NotFound();
        }

        return Ok(medicines);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}




        // PUT: api/medicine/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, Category Category)
        {
            try
            {
                if (id != Category.Id)
                {
                    return BadRequest();
                }

                _context.Entry(Category).State = EntityState.Modified;

                await _context.SaveChangesAsync();

                return Ok("Category updated successfully");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
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

        // DELETE: api/medicine/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var Category = await _context.Categories.FindAsync(id);
                if (Category == null)
                {
                    return NotFound();
                }

                _context.Categories.Remove(Category);
                await _context.SaveChangesAsync();

                return Ok("Category deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
