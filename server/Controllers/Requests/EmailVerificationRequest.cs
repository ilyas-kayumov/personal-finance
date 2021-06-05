
using System.ComponentModel.DataAnnotations;

namespace PersonalFinanceWebApi.Model
{
    public class EmailVerificationRequest
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string VerificationCode { get; set; }
    }
}