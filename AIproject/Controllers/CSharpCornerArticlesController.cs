using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AIproject.Models;
using AIproject.Data;

namespace AIproject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CSharpCornerArticlesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CSharpCornerArticlesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CSharpCornerArticle>>> GetCSharpCornerArticles()
        {
            return await _context.CSharpCornerArticles.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CSharpCornerArticle>> GetCSharpCornerArticle(int id)
        {
            var article = await _context.CSharpCornerArticles.FindAsync(id);

            if (article == null)
            {
                return NotFound();
            }

            return article;
        }


        [HttpPost]
        public async Task<ActionResult<CSharpCornerArticle>> PostCSharpCornerArticle(CSharpCornerArticle article)
        {
            _context.CSharpCornerArticles.Add(article);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCSharpCornerArticle", new { id = article.Id }, article);
        }



        

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCSharpCornerArticle(int id, CSharpCornerArticle article)
        {
            if (id != article.Id)
            {
                return BadRequest();
            }

            _context.Entry(article).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CSharpCornerArticleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCSharpCornerArticle(int id)
        {
            var article = await _context.CSharpCornerArticles.FindAsync(id);
            if (article == null)
            {
                return NotFound();
            }

            _context.CSharpCornerArticles.Remove(article);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CSharpCornerArticleExists(int id)
        {
            return _context.CSharpCornerArticles.Any(e => e.Id == id);
        }
    }
}