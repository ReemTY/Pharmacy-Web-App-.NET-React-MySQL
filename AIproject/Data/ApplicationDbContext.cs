using Microsoft.EntityFrameworkCore;
using AIproject.Models;
namespace AIproject.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<CSharpCornerArticle> CSharpCornerArticles { get; set; }
        public DbSet<Medicine> Medicine { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<SearchHistory> SearchHistory { get; set; }
        public DbSet<RequestedMedicines> RequestedMedicines { get; set; }
        

    }
}