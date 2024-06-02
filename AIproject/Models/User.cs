using System.ComponentModel.DataAnnotations;

namespace AIproject.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public int userRole { get; set; }
        public ICollection<SearchHistory> SearchHistory {get; set;}
        public ICollection<RequestedMedicines> RequestedMedicines {get; set;}
    }
}
