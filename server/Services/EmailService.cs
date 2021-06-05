using MimeKit;
using MailKit.Net.Smtp;
using System.Threading.Tasks;

namespace PersonalFinanceWebApi.Services
{
    public class EmailService
    {
        // public async Task SendVerificationCode(string email)
        // {
        //     var code = GenerateVerificationCode();
        //     await SendEmailAsync(email, "Password Restore", "Verification code: " + code);
        // }

        // private string GenerateVerificationCode()
        // {
        //     return "";
        // }

        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var emailMessage = new MimeMessage();
 
            emailMessage.From.Add(new MailboxAddress("Administration", "multi-currency-finance@protonmail.com"));
            emailMessage.To.Add(new MailboxAddress("", email));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Text)
            {
                Text = message
            };
             
            using (var client = new SmtpClient())
            {
                await client.ConnectAsync("smtp.elasticemail.com", 2525, false);
                await client.AuthenticateAsync("multi-currency-finance@protonmail.com", "09C68605D9C4A1BDDA2FFF96E46415D56229");
                await client.SendAsync(emailMessage);
 
                await client.DisconnectAsync(true);
            }
        }
    }
}