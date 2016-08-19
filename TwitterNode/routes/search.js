var ejs = require("ejs");
var bcrypt = require('./bCrypt.js');
var baseURL = "http://localhost:8080/Twitter/services/";
var soap = require('soap');

exports.userSearchResults = function(req, res) {

	console.log(req.param("searchUsername"));
	console.log("in userSearchResults node");

	var searchUsername = req.param("searchUsername");
	console.log("searchUsername :: " + searchUsername);

	req.session.searchUsername = searchUsername;

	res.send({statusCode:200});	
}

exports.usrSearchResults = function(req, res) {

	console.log("in usrSearchResults");

	//console.log(req.session.searchUsername);
	console.log("userid :: " + req.session.userid);
	console.log("searchUsername :: " + req.session.searchUsername);
	res.render("userSearchResults", {"searchUsername" : req.session.searchUsername, "username" : req.session.username, "userid" : req.session.userid, "email" : req.session.email});
}

exports.searchUser = function(req, res) {
	console.log("in userSearch node");

	//var searchUsername = req.session.searchUsername;
	//var searchUsername = "/.*" + req.param("searchUsername") + ".*/"; // /.*sh.*/ Finds the substring 'sh'	
	var searchUsername = req.session.searchUsername;
	console.log("searchUsername :: " + searchUsername);

	var args = {userid : req.session.userid, username : req.session.username,searchUsername : searchUsername};

	var option = {ignoredNamespaces : true};

	var url = baseURL + "Follower?wsdl";

	soap.createClient(url,option, function(err, client) {

		client.searchUser(args, function(err, data) {
			if(err) {
				console.log("Err :: " + err);
			} else {
				var dataParsed = JSON.parse(data.searchUserReturn);
				console.log(dataParsed);
				console.log(dataParsed.statusCode);

				if(dataParsed.statusCode == 200) {
					console.log(dataParsed.searchUser);
					res.send(JSON.parse(data.searchUserReturn));
				} else if(dataParsed.statusCode == 401){
					console.log("statusCode = 401");
					res.send(JSON.parse(data.searchUserReturn));
				}
			}
		});
	});
}

exports.searchHashTag = function(req, res) {
	console.log("in searchHashTag node");

	req.session.hashtag = "#" + req.param("hashtag");
	console.log("session hashtag :: " + req.session.hashtag);

	res.send({statusCode:200});
}

exports.srcHashTag = function(req, res) {
	
	console.log("in srcHashTag");

	console.log(req.session.hashtag);
	console.log(req.session.userid);

	res.render("searchHash",  {
		"hashtag" : req.session.hashtag, 
		"username" : req.session.username, 
		"userid" : req.session.userid, 
		"email" : req.session.email
	});	
}

exports.searchHash = function(req, res) {
	console.log("in searchHash node");

	var tag = req.session.hashtag;
	var tagwithouthash = tag.split("#");
	console.log("tag is :: " + tag);
	console.log("tagwithouthash is :: " + tagwithouthash[1]);
	
	var args = {tag : tag};

	var option = {ignoredNamespaces : true};

	var url = baseURL + "Follower?wsdl";

	soap.createClient(url,option, function(err, client) {

		client.searchHash(args, function(err, data) {
			if(err) {
				console.log("Err :: " + err);
			} else {
				var dataParsed = JSON.parse(data.searchHashReturn);
				console.log(dataParsed);
				console.log(dataParsed.statusCode);

				if(dataParsed.statusCode == 200) {
					console.log(dataParsed.followingTweets);
					res.send(JSON.parse(data.searchHashReturn));
				} else if(dataParsed.statusCode == 401){
					console.log("statusCode = 401");
					res.send(JSON.parse(data.searchHashReturn));
				}
			}
		});
	});
}