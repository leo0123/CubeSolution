using CubePermissionService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace CubePermissionService.Controllers
{
    [EnableCors(origins: "http://localhost:8273", headers: "*", methods: "*")]
    public class UsersLinesController : ApiController
    {
        public IHttpActionResult GetUsersLine(string id)
        {
            var oneUsersLine = new UsersLine();
            oneUsersLine.ADUserName = "am.user2";
            oneUsersLine.SQLStr = "((a=a and b=c) or (c=c))";
            oneUsersLine.jsonStr = "{ \"IsGroup\": true, \"Field\": null, \"Value\": null, \"GroupLogic\": \" or \", \"Children\": [ { \"IsGroup\": true, \"Field\": null, \"Value\": null, \"GroupLogic\": \" and \", \"Children\": [ { \"IsGroup\": false, \"Field\": \"a\", \"Value\": \"a\", \"GroupLogic\": \"\", \"Children\": null }, { \"IsGroup\": false, \"Field\": \"b\", \"Value\": \"c\", \"GroupLogic\": \"\", \"Children\": null } ] }, { \"IsGroup\": true, \"Field\": null, \"Value\": null, \"GroupLogic\": \" or \", \"Children\": [ { \"IsGroup\": false, \"Field\": \"c\", \"Value\": \"c\", \"GroupLogic\": \"\", \"Children\": null } ] } ] }";
            return Ok(oneUsersLine);
        }
    }
}
