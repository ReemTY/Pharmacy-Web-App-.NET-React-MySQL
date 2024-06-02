using System.Threading.Tasks;
using AIproject.Models;

namespace AIproject.Services
{
    public interface IAdminService
    {
        Task<ServiceResponse<string>> Signup(UserDto userDto);
        Task<ServiceResponse<string>> Login(LoginDto loginDto);
    }
}
