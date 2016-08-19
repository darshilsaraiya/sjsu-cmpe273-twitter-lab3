var ejs = require("ejs");
var bcrypt = require('./bCrypt.js');
var baseURL = "http://localhost:8080/Twitter/services/";
var soap = require('soap');

exports.insertretweet = function(req,res) {
	console.log("in insertretweet node");

	var retweetid = req.param("retweetid");

	console.log("retweetid :: " + retweetid);

	var args = {retweetid : retweetid, userid :req.session.userid};
	var option = {ignoredNamespaces : true};

	var url = baseURL + "Follower?wsdl";

	soap.createClient(url,option, function(err, client) {
		client.insertretweet(args,function(err,data){
			if(err){
				console.log("ERROR :: " + err);
				json_responses = {
					"statusCode" : 401,
					"error" : err
				}
				res.send(json_responses);
			}
			else{
				console.log("data :: " + data.insertretweetReturn);
				res.send(JSON.parse(data.insertretweetReturn));				
			}
		});	
	});
}

exports.deleteretweet = function(req, res) {
	console.log("in deleteretweet node");

	var retweetid = req.param("retweetid");

	console.log("retweetid :: " + retweetid);

	var args = {retweetid : retweetid, userid :req.session.userid};
	var option = {ignoredNamespaces : true};

	var url = baseURL + "Follower?wsdl";

	soap.createClient(url,option, function(err, client) {
		client.deleteretweet(args,function(err,data){
			if(err){
				console.log("ERROR :: " + err);
				json_responses = {
					"statusCode" : 401,
					"error" : err
				}
				res.send(json_responses);
			}
			else{
				console.log("data :: " + data.deleteretweetReturn);
				res.send(JSON.parse(data.deleteretweetReturn));				
			}
		});	
	});
}