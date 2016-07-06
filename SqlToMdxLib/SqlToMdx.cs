using SqlToMdxLib.DAL;
using System.Text.RegularExpressions;
using System.Linq;
using SqlToMdxLib.Models;
using System.Globalization;
using System.Threading;

namespace SqlToMdxLib
{
    public class SqlToMdx
    {
        public void ToTitleCase()
        {
            UsersLineContext db = new UsersLineContext();
            foreach (var Customer in db.CustomerVerticals)
            {
                CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
                TextInfo textInfo = cultureInfo.TextInfo;
                string pattern = @"[a-z]";
                string oldCustomerName = Customer.Customer;
                if (!Regex.IsMatch(oldCustomerName, pattern))
                {
                    string[] list = oldCustomerName.Split(' ');
                    string newCustomerName = null;
                    for (int i = 0; i < list.Count(); i++)
                    {
                        var item = list[i];
                        item = textInfo.ToTitleCase(item.ToLower());
                        newCustomerName += item + " ";
                    }
                    Customer.Customer = newCustomerName;
                }
            }
            db.SaveChanges();
        }

        public void replaceAll()
        {
            UsersLineContext db = new UsersLineContext();
            db.Database.ExecuteSqlCommand(@"update dbo.UsersLineP set MDX=condition");
            db.Database.ExecuteSqlCommand(@"update dbo.UsersLineP 
set MDX=replace(MDX,'OR ([BU] = ''SIB''','') 
WHERE condition LIKE '%\[BU\]%' ESCAPE '\'");

            db.Database.ExecuteSqlCommand(@"update dbo.UsersLineP 
set MDX='{}' 
WHERE condition = 'TranID = 0'");
            db.Database.ExecuteSqlCommand(@"update dbo.UsersLineP 
set MDX='[DimFilter].[FilterId].AllMembers' 
WHERE condition = 'TranID > 0'");

            db.Database.ExecuteSqlCommand(@"UPDATE dbo.UsersLineP
SET MDX=REPLACE(MDX,'BG=','[DimFilter].[BGCode].CurrentMember.name =')
WHERE Condition LIKE '%BG=%'");
            db.Database.ExecuteSqlCommand(@"UPDATE dbo.UsersLineP
SET MDX=REPLACE(MDX,'BG =','[DimFilter].[BGCode].CurrentMember.name =')
WHERE Condition LIKE '%BG =%'");
            db.Database.ExecuteSqlCommand(@"UPDATE dbo.UsersLineP
SET MDX=REPLACE(MDX,'[BG] =','[DimFilter].[BGCode].CurrentMember.name =')
WHERE Condition LIKE '%\[BG\] =%' ESCAPE '\'");
            db.Database.ExecuteSqlCommand(@"UPDATE dbo.UsersLineP
SET MDX=REPLACE(MDX,'SalesP=','[DimFilter].[SalesP].CurrentMember.name =')
WHERE Condition LIKE '%SalesP=%'");
            db.Database.ExecuteSqlCommand(@"UPDATE dbo.UsersLineP
SET MDX=REPLACE(MDX,'SalesP =','[DimFilter].[SalesP].CurrentMember.name =')
WHERE Condition LIKE '%SalesP =%'");
            db.Database.ExecuteSqlCommand(@"UPDATE dbo.UsersLineP
SET MDX=REPLACE(MDX,'office =','[DimFilter].[Office].CurrentMember.name =')
WHERE Condition LIKE '%office =%'");
            db.Database.ExecuteSqlCommand(@"UPDATE dbo.UsersLineP
SET MDX=REPLACE(MDX,'[office] =','[DimFilter].[Office].CurrentMember.name =')
WHERE Condition LIKE '%\[office\] =%' ESCAPE '\'");
            db.Database.ExecuteSqlCommand(@"UPDATE dbo.UsersLineP
SET MDX=REPLACE(MDX,'ProfitCenter =','[DimFilter].[ProfitCenterCode].CurrentMember.name =')
WHERE Condition LIKE '%ProfitCenter =%'");
            db.Database.ExecuteSqlCommand(@"UPDATE dbo.UsersLineP
SET MDX=REPLACE(MDX,'[End Customer] =','[DimFilter].[EndCustomerName].CurrentMember.name =')
WHERE Condition LIKE '%\[End Customer\] =%' ESCAPE'\'");
            db.Database.ExecuteSqlCommand(@"UPDATE dbo.UsersLineP
SET MDX=REPLACE(MDX,'[ShipType] =','[DimFilter].[SalesTypeName].CurrentMember.name =')
WHERE Condition LIKE '%\[ShipType\] =%' ESCAPE'\'");
            db.Database.ExecuteSqlCommand(@"UPDATE dbo.UsersLineP
SET MDX=REPLACE(MDX,'[Sales Type] =','[DimFilter].[SalesTypeName].CurrentMember.name =')
WHERE Condition LIKE '%\[Sales Type\] =%' ESCAPE'\'");
            db.Database.ExecuteSqlCommand(@"UPDATE dbo.UsersLineP
SET MDX=REPLACE(MDX,'[Sales Office] =','[DimFilter].[SalesOffice].CurrentMember.name =')
WHERE Condition LIKE '%\[Sales Office\] =%' ESCAPE '\'");

            db.Database.ExecuteSqlCommand(@"update dbo.UsersLineP set MDX1=MDX");

            foreach (var item in db.UsersLinePs)
            {
                item.MDX = replaceIn(item.MDX, "BG", "BGCode");
                item.MDX = replaceIn(item.MDX, "SalesP", "SalesP");
                item.MDX = replaceIn(item.MDX, "office", "Office");
                item.MDX = replaceIn(item.MDX, "ProfitCenter", "ProfitCenterCode");
                item.MDX = replaceIn(item.MDX, @"[End Customer]", "EndCustomerName");
                item.MDX = replaceIn(item.MDX, @"[Sales Office]", "SalesOffice");
                item.MDX = replaceLike(item.MDX, "ProfitCenter", "ProfitCenterCode");
                item.MDX = replaceStartWith(item.MDX, "ProfitCenter", "ProfitCenterCode");
                item.MDX = replaceStartWith(item.MDX, "[End Customer]", "EndCustomerName");
                //string[] MDXs = replaceSoldToCode(item.MDX, db);
                //item.MDX = MDXs[0];
                //item.MDX1 = MDXs[1];
                item.MDX = replaceSoldToCode(item.MDX, db);
            }
            db.SaveChanges();
            db.Database.ExecuteSqlCommand(@"update dbo.UsersLineP 
set MDX=replace(MDX,MDX,'Filter([DimFilter].[FilterId].Members,'+MDX+')') 
WHERE condition not like '%TranID%'");
        }

        string replaceSoldToCode(string condition, UsersLineContext db)
        {
            string pattern = @"\band\b\s*\[\bSold\b\s\bTo\b.*?\)";
            string subPattern = @"\(\bselect\b.*?\)";
            string oldValue = null;
            string newValue = null;
            string sql = null;
            string condition1 = condition;
            string sqlBase = @"SELECT NAME1 as CustomerName,KUNNR as CustomerCode
FROM dbo.YKNA1
WHERE KUNNR IN ({0})";
            foreach (Match result in Regex.Matches(condition, pattern, RegexOptions.IgnoreCase))//[Sold To Code] in (...)
            {
                oldValue = result.Value;
                sql = Regex.Match(oldValue, subPattern, RegexOptions.IgnoreCase).Value;//(select custkey from customermaster where salesperson like '...%')
                //sql = sql.Replace("custkey", "*");//SqlQuery need to match Entity
                sql = string.Format(sqlBase, sql);
                var list = db.Database.SqlQuery<SoldToCustomer>(sql);
                //var list = db.CustomerMasters.SqlQuery(sql);
                newValue = null;
                //condition1 = condition1.Replace(oldValue, newValue);
                foreach (SoldToCustomer item in list)
                {
                    newValue += string.Format(@" or [DimFilter].[SoldToCustomerName].CurrentMember.name='{0}' ", item.CustomerName);
                }
                if (newValue != null)
                {
                    newValue = newValue.TrimStart(" or".ToCharArray());
                    newValue = string.Format("({0})", newValue);
                }
                newValue = " and" + newValue;
                condition = condition.Replace(oldValue, newValue);
            }
            return condition;
            //return new string[] { condition, condition1 };
        }

        string replaceIn(string condition, string oldField, string newField)
        {
            if (condition == "(SalesP IN ('EDUHA', 'SSALA'))" && oldField == "SalesP")
            { 
            }
            string pattern;
            if (oldField.StartsWith("[") && oldField.EndsWith("]"))
            {
                pattern = @"{0}\s*\bIN\b\s*\(.*?\)";
                oldField = oldField.Replace("[", @"\[");
                oldField = oldField.Replace("]", @"\]");
            }
            else
            {
                pattern = @"\b{0}\b\s*\bIN\b\s*\(.*?\)";
            }
            pattern = string.Format(pattern, oldField);
            string subPattern = @"\(.*?\)";
            string pre = string.Format(@" or [DimFilter].[{0}].CurrentMember.name = ", newField);
            string oldValue = null;
            string newValue = null;
            string members = null;
            foreach (Match result in Regex.Matches(condition, pattern, RegexOptions.IgnoreCase))
            {
                oldValue = result.Value;//BG IN ('IABG','MPBG')
                members = Regex.Match(oldValue, subPattern).Value;//('IABG','MPBG')
                members = members.TrimStart('(');
                members = members.TrimEnd(')');
                foreach (string member in members.Split(','))
                {
                    newValue += pre + member.Trim();
                }
                newValue = newValue.TrimStart(" or ".ToCharArray());
                newValue = "(" + newValue + ")";
                condition = condition.Replace(oldValue, newValue);
            }
            return condition;
        }

        string replaceLike(string condition, string oldField, string newField)//ProfitCenter
        {
            string pattern = @"\b{0}\b\s*\blike\b\s*'%.*?%'";
            pattern = string.Format(pattern, oldField);
            string subPattern = @"'%.*?%'";
            string pre = @"instr([DimFilter].[{0}].CurrentMember.name, '{1}')>=1";
            string oldValue = null;
            string newValue = null;
            string partString = null;
            foreach (Match result in Regex.Matches(condition, pattern, RegexOptions.IgnoreCase))
            {
                oldValue = result.Value;//ProfitCenter like '%VTN%'
                partString = Regex.Match(oldValue, subPattern).Value;//'%VTN%'
                partString = partString.TrimStart(@"'%".ToCharArray());
                partString = partString.TrimEnd(@"%'".ToCharArray());
                newValue = string.Format(pre, newField, partString);
                condition = condition.Replace(oldValue, newValue);
            }
            return condition;
        }

        string replaceStartWith(string condition, string oldField, string newField)//ProfitCenter
        {
            string pattern = @"\b{0}\b\s*\blike\b\s*'[^%].*?%'";
            if (oldField.StartsWith("[") && oldField.EndsWith("]"))
            {
                pattern = @"{0}\s*\blike\b\s*'[^%].*?%'";
                oldField = oldField.Replace("[", @"\[");
                oldField = oldField.Replace("]", @"\]");
            }
            else
            {
                pattern = @"\b{0}\b\s*\blike\b\s*'[^%].*?%'";
            }
            pattern = string.Format(pattern, oldField);
            string subPattern = @"'.*?%'";
            string pre = @"instr([DimFilter].[{0}].CurrentMember.name, '{1}')=1";
            string oldValue = null;
            string newValue = null;
            string partString = null;
            foreach (Match result in Regex.Matches(condition, pattern, RegexOptions.IgnoreCase))
            {
                oldValue = result.Value;//ProfitCenter like '%VTN%'
                partString = Regex.Match(oldValue, subPattern).Value;//'%VTN%'
                partString = partString.TrimStart(@"'".ToCharArray());
                partString = partString.TrimEnd(@"%'".ToCharArray());
                newValue = string.Format(pre, newField, partString);
                condition = condition.Replace(oldValue, newValue);
            }
            return condition;
        }
    }
}
