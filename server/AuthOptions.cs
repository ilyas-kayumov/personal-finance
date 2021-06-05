using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace PersonalFinanceWebApi
{
    public class AuthOptions
    {
        public static SymmetricSecurityKey GetSymmetricSecurityKey(string key)
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key));
        }
    }
}
