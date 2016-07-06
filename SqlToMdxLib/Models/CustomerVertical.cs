using System.ComponentModel.DataAnnotations.Schema;

namespace SqlToMdxLib.Models
{
    [Table("CustomerVertical")]
    public class CustomerVertical
    {
        public int id { get; set; }

        public string Customer { get; set; }

        public string Vertical { get; set; }
    }
}
