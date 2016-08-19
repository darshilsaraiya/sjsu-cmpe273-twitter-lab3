var ejs = require("ejs");
var bcrypt = require('./bCrypt.js');
var baseURL = "http://localhost:8080/Twitter/services/";
var soap = require('soap');

exports.getprofiledetails = function(req,res) {
	console.log("in getprofiledetails node");

	var email = req.session.email;
	console.log(req.session);
	console.log("email :: " + email);

	var args = {email : req.session.email};

	var option = {ignoredNamespaces : true};

	var url = baseURL + "Profile?wsdl";

	soap.createClient(url,option, function(err, client) {

		client.getprofiledetails(args, function(err, data) {
			if(err) {
				console.log("err :: " + err);
				var json_responses = {"statusCode" : 401, "error" : err};
			} else {
				console.log(data.getprofiledetailsReturn);
				var dataParsed = JSON.parse(data.getprofiledetailsReturn);
				console.log(dataParsed);
				console.log(dataParsed.statusCode);
				if(dataParsed.statusCode == 200) {
					console.log("statusCode == 200");
					var result = {
						"userid" : dataParsed.userid,
						"username" : dataParsed.username,
						"firstname" : dataParsed.firstname,
						"lastname" : dataParsed.lastname,
						"email" : dataParsed.email,
						"gender" : dataParsed.gender,
						"birthdate" : dataParsed.birthdate,
						"location" : dataParsed.location,
						"contact" : dataParsed.contact
					};

					var json_responses = {"statusCode" : 200,"data" : result};

					res.send(json_responses);
				} else {
					console.log("statusCode == 401");
					res.send(JSON.parse(data.getprofiledetailsReturn));	
				}
			}
		});
	});
}

exports.getUserTweetsDetails = function(req,res) {
	console.log("in getUserTweetsDetails node");

	var userid = req.session.userid;
	console.log("userid = " + userid);
	
	var args = {userid : req.session.userid};

	var option = {ignoredNamespaces : true};

	var url = baseURL + "Profile?wsdl";

	soap.createClient(url,option, function(err, client) {

		client.getUserTweetsDetails(args, function(err, data) {
			if(err) {
				console.log("err :: " + err);
				var json_responses = {"statusCode" : 401, "error" : err};
			} else {
				var dataParsed = JSON.parse(data.getUserTweetsDetailsReturn);
				console.log("getUserTweetsDetailsReturn :: " + dataParsed);

				if(dataParsed.statusCode == 200) {
					console.log(dataParsed.userTweets);
					res.send(JSON.parse(data.getUserTweetsDetailsReturn));
				} else {
					res.send(JSON.parse(data.getUserTweetsDetailsReturn));
				}
			}
		});
	});
}