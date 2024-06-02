using Microsoft.AspNetCore.Http;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;

namespace AIproject.Utilities
{
    public static class JwtUtility
    {
        public static int? GetUserIdFromRequest(HttpContext httpContext)
        {
            // Get the Authorization header value from the request
            string authorizationHeader = httpContext.Request.Headers["Authorization"];

            if (!string.IsNullOrEmpty(authorizationHeader) && authorizationHeader.StartsWith("Bearer "))
            {
                // Extract the JWT token from the Authorization header
                string token = authorizationHeader.Substring("Bearer ".Length).Trim();

                // Decode the token to get claims
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
                
                // Extract the user ID claim from the token
                var userIdClaim = jsonToken?.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier);
                
                if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
                {
                    return userId;
                }
            }

            // If unable to extract user ID, return null
            return null;
        }
    }
}
