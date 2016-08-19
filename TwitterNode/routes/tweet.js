var ejs = require("ejs");
var bcrypt = require('./bCrypt.js');
var baseURL = "http://localhost:8080/Twitter/services/";
var soap = require('soap');

exports.doTweet = function(req,res) {
	console.log("in doTweet");

	var tweetString = req.param("tweet");
	var email = req.session.email;
	console.log("tweet :: " + tweetString);
	console.log("userid :: " + req.session.userid);

	var taglistarray = tweetString.match(/#\S+/g);
	
	console.log("taglistarray :: " + taglistarray);

	var args = {userid : req.session.userid, tweet : tweetString};

	var option = {ignoredNamespaces : true};

	var url = baseURL + "Follower?wsdl";

	soap.createClient(url,option, function(err, client) {

		client.doTweet(args, function(err, data) {
			if(err) {
				console.log("Err :: " + err);
			} else {
				var dataParsed = JSON.parse(data.doTweetReturn);
				console.log(dataParsed);
				console.log(dataParsed.statusCode);

				if(dataParsed.statusCode == 200) {
					console.log(dataParsed.searchUser);
					res.send(JSON.parse(data.doTweetReturn));
				} else if(dataParsed.statusCode == 401){
					console.log("statusCode = 401");
					res.send(JSON.parse(data.doTweetReturn));
				}
			}
		});
	});
};