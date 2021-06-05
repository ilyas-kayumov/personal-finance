using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PersonalFinanceWebApi.Model
{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<EmailVerification> EmailVerifications { get; set; }
        public IConfiguration Configuration { get; }

        public ApplicationContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            builder.UseLazyLoadingProxies().UseNpgsql(Configuration.GetConnectionString("DefaultConnection"));
        }

        public async Task<User> FindUserAsync(string login)
        {
            return await Users.FirstOrDefaultAsync(u => u.Login == login);
        }

        public async Task<User> FindUserAsync(string login, string password)
        {
            return await Users.FirstOrDefaultAsync(u => u.Login == login && u.Password == password);
        }

        public async Task AddUserAsync(string login, string password)
        {
            var user = new User(login, password);
            await AddAsync(user);
            await SaveChangesAsync();

            var balance = new Balance() { UserId = user.Id };
            await AddAsync(balance);
            await SaveChangesAsync();
        }

        public async Task DeleteUser(string login)
        {
            var user = await FindUserAsync(login);
            RemoveRange(user.Balance.MoneyAccounts.Select(a => a.Money));
            Remove(user);
        }
        public async Task AddCurrencyAsync(string currency, decimal rate)
        {
            await AddAsync(new Currency(currency, rate));
        }

        public Task<User> GetPersonByPrincipalAsync(ClaimsPrincipal principal)
        {
            var value = principal.FindFirst(ClaimTypes.Name).Value;
            return Users.SingleAsync(u => u.Login == value);
        }
    }
}