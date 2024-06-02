using AIproject.Data;
using Microsoft.EntityFrameworkCore;

namespace AIproject.Services;

public class authenticationService
{
    private readonly ApplicationDbContext _context;

    public authenticationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int?> AuthenticateUser(string username, string password)
    {

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username && u.PasswordHash == password);
        if (user != null)
        {
            return user.Id;
        }
        else
        {
            return null;
        }
    }
}
