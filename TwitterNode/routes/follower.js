var ejs = require("ejs");
var baseURL = "http://localhost:8080/Twitter/services/";
var soap = require('soap');

exports.getfollowingtweets = function(req, res) {
	console.log("in getfollowingtweets node-middleware");

	var userid = req.session.userid;
	console.log(req.session);
	console.log("userid :: " + userid);

	var args = {userid : req.session.userid};

	var option = {ignoredNamespaces : true};

	var url = baseURL + "Follower?wsdl";

	soap.createClient(url,option, function(err, client) {

		client.getfollowingtweets(args, function(err, data) {
			if(err) {
				console.log("Err :: " + err);
			} else {
				var dataParsed = JSON.parse(data.getfollowingtweetsReturn);
				console.log(dataParsed);
				console.log(dataParsed.statusCode);

				if(dataParsed.statusCode == 200) {
					console.log(dataParsed.followingTweets);
					res.send(JSON.parse(data.getfollowingtweetsReturn));
				} else if(dataParsed.statusCode == 401){
					console.log("statusCode = 401");
					res.send(JSON.parse(data.getfollowingtweetsReturn));
				}
			}
		});
	});
}

exports.viewfollowing = function(req, res) {
	console.log("in viewfollowing node");

	res.render("viewfollowing",{"username" : req.session.username, "userid" : req.session.userid, "email" : req.session.email});
}

exports.viewfollowers = function(req, res) {
	console.log("in viewfollowers node")

	res.render("viewfollowers",{"username" : req.session.username, "userid" : req.session.userid, "email" : req.session.email});
}

exports.getfollowing = function(req, res) {
	console.log("in getfollowing node");
	
	var userid = req.session.userid;
	console.log("userid :: " + userid);

	var args = {userid : req.session.userid};

	var option = {ignoredNamespaces : true};

	var url = baseURL + "Follower?wsdl";

	soap.createClient(url,option, function(err, client) {

		client.getfollowing(args, function(err, data) {
			if(err) {
				console.log("Err :: " + err);
			} else {
				var dataParsed = JSON.parse(data.getfollowingReturn);
				console.log(dataParsed);
				console.log(dataParsed.statusCode);

				if(dataParsed.statusCode == 200) {
					//console.log(dataParsed.searchUser);
					res.send(JSON.parse(data.getfollowingReturn));
				} else if(dataParsed.statusCode == 401){
					console.log("statusCode = 401");
					res.send(JSON.parse(data.getfollowingReturn));
				}
			}
		});
	});
}

exports.getfollower = function(req, res) {
	console.log("in getfollower node");
	
	var userid = req.session.userid;
	console.log("userid :: " + userid);

	var args = {userid : req.session.userid};

	var option = {ignoredNamespaces : true};

	var url = baseURL + "Follower?wsdl";

	soap.createClient(url,option, function(err, client) {

		client.getfollower(args, function(err, data) {
			if(err) {
				console.log("Err :: " + err);
			} else {
				var dataParsed = JSON.parse(data.getfollowerReturn);
				console.log(dataParsed);
				console.log(dataParsed.statusCode);

				if(dataParsed.statusCode == 200) {
					//console.log(dataParsed.searchUser);
					res.send(JSON.parse(data.getfollowerReturn));
				} else if(dataParsed.statusCode == 401){
					console.log("statusCode = 401");
					res.send(JSON.parse(data.getfollowerReturn));
				}
			}
		});
	});
}

exports.deletefollowing = function(req, res) {
	console.log("in delete Following node");

	var deletefollowingid = req.param("deletefollowingid");
	console.log("deletefollowingid :: " + deletefollowingid);

	var args = {userid : req.session.userid, deletefollowingid : deletefollowingid};

	var option = {ignoredNamespaces : true};

	var url = baseURL + "Follower?wsdl";

	soap.createClient(url,option, function(err, client) {

		client.deletefollowing(args, function(err, data) {
			if(err) {
				console.log("Err :: " + err);
			} else {
				var dataParsed = JSON.parse(data.deletefollowingReturn);
				console.log(dataParsed);
				console.log(dataParsed.statusCode);

				if(dataParsed.statusCode == 200) {
					//console.log(dataParsed.searchUser);
					res.send(JSON.parse(data.deletefollowingReturn));
				} else if(dataParsed.statusCode == 401){
					console.log("statusCode = 401");
					res.send(JSON.parse(data.deletefollowingReturn));
				}
			}
		});
	});
}

exports.insertfollowing = function(req, res) {
	console.log("in insert Following node");

	var insertfollowingid = req.param("insertfollowingid");
	console.log("insertfollowingid :: " + insertfollowingid);

	var args = {userid : req.session.userid, insertfollowingid : insertfollowingid};

	var option = {ignoredNamespaces : true};

	var url = baseURL + "Follower?wsdl";

	soap.createClient(url,option, function(err, client) {

		client.insertfollowing(args, function(err, data) {
			if(err) {
				console.log("Err :: " + err);
			} else {
				var dataParsed = JSON.parse(data.insertfollowingReturn);
				console.log(dataParsed);
				console.log(dataParsed.statusCode);

				if(dataParsed.statusCode == 200) {
					//console.log(dataParsed.searchUser);
					res.send(JSON.parse(data.insertfollowingReturn));
				} else if(dataParsed.statusCode == 401){
					console.log("statusCode = 401");
					res.send(JSON.parse(data.insertfollowingReturn));
				}
			}
		});
	});
}