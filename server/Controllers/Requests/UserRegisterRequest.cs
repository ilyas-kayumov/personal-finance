using System.ComponentModel.DataAnnotations;

namespace PersonalFinanceWebApi.Controllers
{
    public class UserRegisterRequest
    {
        [Required, EmailAddress]
        public string Login { get; set; }
        [Required, MinLength(6)]
        public string Password { get; set; }
    }
}