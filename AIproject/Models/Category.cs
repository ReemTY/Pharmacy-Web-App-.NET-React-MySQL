using System.ComponentModel.DataAnnotations;

namespace AIproject.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; } // Add Id property

        public string Name { get; set; }
        
        public string? Description { get; set; }
        public ICollection<Medicine> medicines {get; set;}

    }
}
