using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AIproject.Models
{
    public class Medicine
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        [ForeignKey("category")]
        public int CategoryId {get; set;}
        [JsonIgnore]
        public Category? category {get; set;}

    }
}
