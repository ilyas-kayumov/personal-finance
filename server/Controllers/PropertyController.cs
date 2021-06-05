using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PersonalFinanceWebApi.Model;

[ApiController]
[Route("api/balance/[controller]/[action]")]
public class PropertyController : ControllerBase
{
    // private readonly BalanceContext balance;

    // public PropertyController(BalanceContext balance)
    // {
    //     this.balance = balance;
    // }

    // [HttpPost]
    // public async Task<int> Create(Property property)
    // {
    //     await balance.AddAsync(property);
    //     await balance.SaveChangesAsync();
    //     return property.Id;
    // }

    // [HttpPut]
    // public async Task Update(Property property)
    // {
    //     balance.Update(property);
    //     await balance.SaveChangesAsync();
    // }

    // [HttpDelete]
    // public async Task Delete(int id)
    // {
    //     var property = await balance.FindProperty(id);
    //     balance.Remove(property);
    //     await balance.SaveChangesAsync();
    // }
}