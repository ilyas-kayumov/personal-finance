using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Newtonsoft.Json;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using PersonalFinanceWebApi.Model;
using PersonalFinanceWebApi.Services;
using Microsoft.EntityFrameworkCore;
using PasswordGenerator;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace PersonalFinanceWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly ILogger<AccountController> logger;
        private readonly ApplicationContext context;
        private readonly CryptoService cryptoService;
        private readonly EmailService emailService;

        public object Membership { get; private set; }
        public IConfiguration Configuration { get; }

        public AccountController(ILogger<AccountController> logger, ApplicationContext context, 
            CryptoService cryptoService, EmailService emailService, IConfiguration configuration)
        {
            this.logger = logger;
            this.context = context;
            this.cryptoService = cryptoService;
            this.emailService = emailService;
            Configuration = configuration;
        }

        public async Task<string> LoginWithoutRegistration()
        {
            var login = "Anonymous-" + Guid.NewGuid();
            var password = Guid.NewGuid().ToString();
            await context.AddUserAsync(login, password);
            await context.SaveChangesAsync();
            return await TryLogin(new UserLoginRequest { Login = login, Password = password });
        }

        [HttpPost]
        public async Task<string> Login([FromBody] UserLoginRequest user)
        {
            user.Password = cryptoService.ComputeHash(user.Password);
            return await TryLogin(user);
        }

        private async Task<string> TryLogin(UserLoginRequest user)
        {
            var identity = await GetIdentity(user.Login, user.Password);
            if (identity == null)
            {
                Response.StatusCode = 400;
                return "Invalid login or password";
            }

            var now = DateTime.UtcNow;
            var jwt = new JwtSecurityToken(
                    issuer: Configuration["AuthOptions:Issuer"],
                    audience: Configuration["AuthOptions:Audience"],
                    notBefore: now,
                    claims: identity.Claims,
                    expires: now.Add(TimeSpan.FromHours(int.Parse(Configuration["AuthOptions:Lifetime"]))),
                    signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(Configuration["AuthOptions:Key"]), SecurityAlgorithms.HmacSha256));

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }

        [HttpPost]
        public async Task<string> Register([FromBody] UserRegisterRequest user)
        {
            user.Password = cryptoService.ComputeHash(user.Password);
            
            var identity = await context.FindUserAsync(user.Login);
            if (identity != null)
            {
                logger.LogInformation("exists");
                Response.StatusCode = 400;
                return "User with this login already exists";
            }
            await context.AddUserAsync(user.Login, user.Password);
            await context.SaveChangesAsync();
            return await TryLogin(new UserLoginRequest { Login = user.Login, Password = user.Password });
        }

        [HttpPost]
        public async Task<string> SendVerificationCode(string email)
        {
            var verifications = context.EmailVerifications.Where(v => v.Email == email).ToArray();

            if (verifications.Length > 0) {
                logger.LogInformation("Remove verification");
                context.RemoveRange(verifications);
                await context.SaveChangesAsync();
            }

            var identity = await context.FindUserAsync(email);
            if (identity == null)
            {
                logger.LogInformation("not exists");
                Response.StatusCode = 400;
                return "User does not exists";
            }

            var emailVerification = new EmailVerification() 
            {
                Email = email,
                VerificationCode = GenerateVerificationCode()
            };

            await context.AddAsync(emailVerification);
            await context.SaveChangesAsync();

            var message = "Verification Code: " + emailVerification.VerificationCode;
            await emailService.SendEmailAsync(email, "Passsword Reset", message);

            return "OK";
        }

        [HttpPut]
        public async Task<string> VerifyEmail(EmailVerificationRequest request)
        {
            var verification = await context.EmailVerifications.SingleOrDefaultAsync(v => 
                v.Email == request.Email && v.VerificationCode == request.VerificationCode);

            if (verification == null)
            {
                logger.LogInformation("Invalid verification code or email");
                Response.StatusCode = 400;
                return "Invalid verification code or email";
            }

            verification.IsVerified = true;

            context.Update(verification);
            await context.SaveChangesAsync();

            return "OK";
        }

        [HttpPut]
        public async Task<string> ResetPassword(ResetPasswordRequest request)
        {
            var verification = await context.EmailVerifications.SingleOrDefaultAsync(v => 
                v.Email == request.Email);

            if (verification == null)
            {
                logger.LogInformation("Invalid email");
                Response.StatusCode = 400;
                return "Invalid email";
            }

            if (!verification.IsVerified)
            {
                logger.LogInformation("Unverified email");
                Response.StatusCode = 400;
                return "Unverified email";
            }

            var user = await context.FindUserAsync(request.Email);
            if (user == null)
            {
                logger.LogInformation("User has not been found");
                Response.StatusCode = 400;
                return "User has not been found";
            }

            user.Password = cryptoService.ComputeHash(request.NewPassword);

            context.Update(user);

            context.EmailVerifications.Remove(verification);

            await context.SaveChangesAsync();

            logger.LogInformation("OK");

            return "OK";
        }

        private string GenerateVerificationCode()
        {
            return new Password(includeLowercase:false,
                                includeUppercase:false,
                                includeNumeric: true,
                                includeSpecial:false,
                                passwordLength: 4).Next();
        }

        private async Task<ClaimsIdentity> GetIdentity(string login, string password)
        {
            var user = await context.FindUserAsync(login, password);
            if (user != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimsIdentity.DefaultNameClaimType, user.Login)
                };

                return new ClaimsIdentity(
                    claims,
                    "Token",
                    ClaimsIdentity.DefaultNameClaimType,
                     ClaimsIdentity.DefaultRoleClaimType);
            }

            return null;
        }
    }
}