"use strict";

var mysql = require("mysql");

var con = mysql.createConnection({ host: "planetpratt.com",port: 6603,"user": "Chris","password": "denise"});

con.query("CREATE DATABASE node",function (err) {
	if(!err) {
		con.query("USE node",function (err) {
			if(!err) {
				con.query("CREATE TABLE test (id INT(11) AUTO_INCREMENT, content VARCHAR(255), PRIMARY KEY(id))",function (err) {
					if(!err) {
						con.query("INSERT INTO test (content) VALUES ('Hello')");
						con.query("INSERT INTO test (content) VALUES ('World')");
            con.end();
					} else {
						console.log("Could not create table 'test': " + err);
					}
				});
			} else {
				console.log("Could not switch to database 'node': " + err);
			}
		});
	} else {
		console.log("Could not create database 'node': " + err);
  }
});