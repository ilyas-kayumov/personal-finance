
namespace PersonalFinanceWebApi.Model
{
    public class EmailVerification
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string VerificationCode { get; set; }
        public bool IsVerified  { get; set; }
    }
}