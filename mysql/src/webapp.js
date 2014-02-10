"use strict";

var mysql       = require("mysql"),
    http        = require("http"),
    url         = require("url"),
    querystring = require("querystring");
    
const mysqlParams = {
  host: "planetpratt.com",
  port: 6603,
  user: "Chris",
  password: "denise",
  database:"node" 
};
    
http.createServer(handleRequest).listen(8888);
    
function handleRequest (req,res) {
	var pageContent = 
    "<html>" + 
    "  <head>" + 
    "    <meta http-equiv=\"ContentType\" content=\"text/html; charset=UTF-8\"/>" +
    "  </head>" + 
    "  <body>" +
    "    <form action=\"/add\" method=\"POST\">" + 
    "      <input type=\"text\" name=\"content\" />" +
    "      <input type=\"submit\" value=\"Add Content\" />" +
    "    </form>" + 
    "    <div>" +
    "      <strong>Content in database:</strong>" +
    "      <pre>{{dbcontent}}</pre>" +
    "    </div>" +
    "    <form action=\"/\" method=\"GET\">" +
    "      <input type=\"text\" name=\"q\" />" +
    "      <input type=\"submit\" value=\"Filter Content\" />" +
    "    </form>" +
    "  </body>" +
    "</html>";
    // Parse the requested URL the route
	var pathname = url.parse(req.url).pathname;
	if(pathname == "/add") {
		var reqBody = "";
		var postParameters;
		req.on("data",function (data) {
			reqBody += data;
		});
		req.on("end",function () {
			postParameters = querystring.parse(reqBody);
        // The Content to be added is in POST parameter "content"
      addContentToDatabase(postParameters.content,function () {
        // Redirect back to homepage when the database has finished adding
        // new content to the database
      res.writeHead(302,{ Location: "/" });
      res.end();
      });
		});
	} else {
      // The text to use for filtering is in GET parameter "q"
		var filter = querystring.parse(url.parse(req.url).query).q;
		getContentsFromDatabase(filter,function (contents) {
			res.writeHead(200,{ "Content-Type": "text/html"});
        // Poor man's templating system:  Replace "{{dbcontent}}" in HTML with 
        // actual content from the database
      res.write(pageContent.replace("{{dbcontent}}",contents));
      res.end();
		});
	}
} //handleRequest

// Function that is called by the code to handle the "/" route and retrieve
// content from the database, applying a LIKE filter if one was supplied
function getContentsFromDatabase (filter,callback) {
	var con = mysql.createConnection(mysqlParams);
	var query;
	var resultsAsString = "";
	if(filter) {
		query = con.query("SELECT id, content FROM test WHERE content LIKE '" + filter + "%'");
	} else {
		query = con.query("SELECT id, content FROM test");
	}
	query.on("error",function (err) {
		console.log("A database error occured: " + err);
	});
    // With every result, build the string that is later replaced into the HTML
	query.on("result",function (res) {
		resultsAsString += "id: " + res.id;
		resultsAsString += ", content: " + res.content;
		resultsAsString += '\n';
	});
    // When we have worked through all results, we call the callback with our completed string
	query.on("end",function () {
		con.end();
		callback(resultsAsString);
	});
} //getContentsFromDatabase

// Function that is called by the code that handles the "/add" route and
// inserts the supplied string as a new content entry
function addContentToDatabase (content,callback) {
	var con = mysql.createConnection(mysqlParams);
  con.query("INSERT INTO test (content) VALUES ('" + content + "')",function (err) {
    if(err) {
      console.log("Could not insert content '" + content + "' into database.");
    }
    callback();
  });	
} //addContentToDatabase
