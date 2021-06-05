using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

public class CurrenciesRatesProviderService
{
    public static async Task<JObject> GetRates(string url)
    {
        // For Release
        var response = await new HttpClient().GetAsync(url + "/latest?base=USD");

        var responseContent = await response.Content.ReadAsStringAsync();

        // For Debug
        // var responseContent = "{\"rates\":{\"CAD\":1.3762169047,\"HKD\":7.7521608589,\"ISK\":137.5671003548,\"PHP\":50.648712583,\"DKK\":6.7858247657,\"HUF\":317.2595760167,\"CZK\":24.6119552361,\"GBP\":0.8151669548,\"RON\":4.4066054044,\"SEK\":9.6085888454,\"IDR\":14709.9990901647,\"INR\":75.7392411973,\"BRL\":5.3388226731,\"RUB\":71.066872896,\"HRK\":6.9050131926,\"JPY\":107.8882722227,\"THB\":31.8951869712,\"CHF\":0.9712492039,\"EUR\":0.9098353198,\"MYR\":4.3474661086,\"BGN\":1.7794559185,\"TRY\":6.7820944409,\"CNY\":7.1587662633,\"NOK\":9.8519697935,\"NZD\":1.6121372032,\"ZAR\":17.4212537531,\"USD\":1.0,\"MXN\":22.3269948139,\"SGD\":1.4182512965,\"AUD\":1.5071422073,\"ILS\":3.5038668001,\"KRW\":1236.5025930307,\"PLN\":4.037121281},\"base\":\"USD\",\"date\":\"2020-05-27\"}";

        return (JObject)JObject.Parse(responseContent)["rates"];
    }
}