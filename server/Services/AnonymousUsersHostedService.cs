using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PersonalFinanceWebApi.Model;

public class AnonymousUsersHostedService : IHostedService
{
    private readonly IServiceScopeFactory scopeFactory;
    private readonly Timer timer;

    public AnonymousUsersHostedService(IServiceScopeFactory scopeFactory)
    {
        this.scopeFactory = scopeFactory;

        var period = (int) TimeSpan.FromSeconds(10).TotalMilliseconds;
        timer = new Timer(DoWork, null, period, period);
    }

    private async void DoWork(object state)
    {
        using (var scope = scopeFactory.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
            await DeleteAnonymousUsers(context);
        }
    }

    public async Task DeleteAnonymousUsers(ApplicationContext context)
    {
        var now = DateTime.Now;
        var latest = now.AddHours(-6);
        var anonymousUsers = context.Users.Where(u => u.Login.StartsWith("Anonymous") && !u.Login.Contains("@") && u.CreationTime < latest).ToArray();
        foreach (var anonymous in anonymousUsers) 
        {
            await context.DeleteUser(anonymous.Login);
        }

        await context.SaveChangesAsync();
    }


    public Task StartAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}