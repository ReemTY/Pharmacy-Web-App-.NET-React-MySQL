namespace AIproject.Models
{
    public class UserDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int userRole { get; set; } // Added property for IsAdmin
    }
}
