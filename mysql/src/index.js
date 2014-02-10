"use strict";

var mysql = require("mysql");

var con = mysql.createConnection({ host: "planetpratt.com",port: 6603,user: "Chris",password: "denise",database:"node" });

var query = con.query("SELECT id, content FROM test");

query.on("error",function (err) {
	console.log("A database error occured: " + err);
});

query.on("fields",function (fields) {
	console.log("Received fields information.");
});

query.on("result",function (res) {
	console.log("Received result: ");
	console.log(res);
});

query.on("end",function () {
  console.log("Query execution has finished.");
	con.end();
});