using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AIproject.Models;
public class RequestedMedicines
{
    [Key]
    public int Id { get; set; }
    public string medicine { get; set; }
    public DateTime Timestamp { get; set; }
    public string? status{get; set;}

    [ForeignKey("User")]
    public int UserId {get; set;}
    [JsonIgnore]
    public User? user {get; set;}
}