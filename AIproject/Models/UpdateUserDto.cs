using System.Collections.Generic;

namespace AIproject.Models;
public class UpdateUserDto
{
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? PasswordHash { get; set; }
    public int? UserRole { get; set; }
    public ICollection<SearchHistory>? SearchHistory { get; set; }
    public ICollection<RequestedMedicines>? RequestedMedicines { get; set; }
    // Add any other fields you want to update here
}
