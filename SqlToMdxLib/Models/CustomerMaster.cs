using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SqlToMdxLib.Models
{
    [Table("CustomerMaster")]
    public class CustomerMaster
    {
        [Key]
        public string Custkey { get; set; }

        public string CustomerName { get; set; }

        public string CType { get; set; }

        public string SalesPerson { get; set; }
    }
}
