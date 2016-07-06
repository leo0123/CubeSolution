using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CubePermissionLib
{
    public class Expression
    {
        public bool IsGroup { get; set; }
        public string Field { get; set; }
        public string Value { get; set; }
        public string GroupLink { get; set; }
        public Expression Parent { get; set; }
        public List<Expression> Children { get; set; }
    }
}
