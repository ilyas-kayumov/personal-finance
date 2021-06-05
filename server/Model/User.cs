using System;

namespace PersonalFinanceWebApi.Model
{
    public class User
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public virtual Balance Balance { get; set; }
        public DateTime CreationTime { get; set; }

        public User(string login, string password)
        {
            Login = login;
            Password = password;
            CreationTime = DateTime.Now;
        }
    }
}
