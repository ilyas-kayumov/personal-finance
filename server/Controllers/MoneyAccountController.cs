using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PersonalFinanceWebApi.Model;

[ApiController]
[Authorize]
[Route("api/balance/[controller]/[action]")]
public class MoneyAccountController : ControllerBase
{
    private readonly ILogger<MoneyAccountController> logger;
    private readonly ApplicationContext context;

    public MoneyAccountController(ILogger<MoneyAccountController> logger, ApplicationContext context)
    {
        this.logger = logger;
        this.context = context;
    }

    [HttpPost]
    public async Task<int> Create(MoneyAccount moneyAccount)
    {
        var person = await context.GetPersonByPrincipalAsync(User);
        person.Balance.MoneyAccounts.Add(moneyAccount);
        await context.SaveChangesAsync();
        return moneyAccount.Id;
    }

    [HttpGet]
    public async Task<MoneyAccount> Get(int id)
    {
        var person = await context.GetPersonByPrincipalAsync(User);
        return person.Balance.MoneyAccounts.Single(a => a.Id == id);;
    }

    [HttpPut]
    public async Task Update(MoneyAccount moneyAccount)
    {
        var person = await context.GetPersonByPrincipalAsync(User);
        var foundAccount = person.Balance.MoneyAccounts.Single(m => m.Id == moneyAccount.Id);
        foundAccount.Name = moneyAccount.Name;
        foundAccount.Money.Amount = moneyAccount.Money.Amount;
        foundAccount.Money.Currency = moneyAccount.Money.Currency;
        context.Update(foundAccount);
        await context.SaveChangesAsync();
    }

    [HttpDelete]
    public async Task Delete(int id)
    {
        var person = await context.GetPersonByPrincipalAsync(User);
        var moneyAccount = person.Balance.FindMoneyAccount(id);
        context.Remove(moneyAccount);
        await context.SaveChangesAsync();
    }
}