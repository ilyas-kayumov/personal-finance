using System.ComponentModel.DataAnnotations;

namespace PersonalFinanceWebApi.Controllers
{
    public class UserLoginRequest
    {
        [Required]
        public string Login { get; set; }
        [Required]
        public string Password { get; set; }
    }
}