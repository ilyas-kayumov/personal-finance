using System.Security.Cryptography;
using System.Text;

namespace PersonalFinanceWebApi.Services
{
    public class CryptoService
    {
        public string ComputeHash(string value)
        {
            using (var algorithm = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(value);
                var hash = algorithm.ComputeHash(bytes);
                return GetHexString(hash);
            }
        }

        private string GetHexString(byte[] bytes)
        {
            var hex = new StringBuilder();

            foreach (var @byte in bytes)
            {
                hex.Append(@byte.ToString("x2"));
            }

            return hex.ToString();
        }
    }
}
