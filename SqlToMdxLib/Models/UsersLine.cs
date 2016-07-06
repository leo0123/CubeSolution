using System.ComponentModel.DataAnnotations.Schema;

namespace SqlToMdxLib.Models
{
    [Table("UsersLineP")]
    public class UsersLine
    {
        public int id { get; set; }

        public string UserName { get; set; }

        public string AD_Account { get; set; }

        public string Condition { get; set; }

        public string MDX { get; set; }

        public string MDX1 { get; set; }
    }
}
