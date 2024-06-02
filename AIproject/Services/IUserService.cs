using System.Threading.Tasks;
using AIproject.Models;

namespace AIproject.Services
{
    public interface IUserService
    {
        Task<ServiceResponse<string>> Signup(UserDto userDto);
        Task<ServiceResponse<(string Token, int UserRole)>> Login(LoginDto loginDto);
        Task<ServiceResponse<string>> GetUserByUsername(string username);
        Task<ServiceResponse<string>> GetUserByEmail(string username);

    }
}
