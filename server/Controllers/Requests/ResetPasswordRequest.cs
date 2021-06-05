using System.ComponentModel.DataAnnotations;

namespace PersonalFinanceWebApi.Model
{
    public class ResetPasswordRequest
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string NewPassword { get; set; } 
    }
}