var ejs = require("ejs");
var bcrypt = require('./bCrypt.js');
var baseURL = "http://localhost:8080/Twitter/services/";
var soap = require('soap');

exports.home = function(req, res){
  if(req.session!=null && req.session.username && req.session.email && req.session.userid) {
 	//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

		//here all the data should be post
		res.render("homepage",{username : req.session.username, userid : req.session.userid,email : req.session.email});
	}
 else
 	res.render('home');
};

exports.signup = function(req,res) {

	//console.log("isEmailExists :: " + req.param("isEmailExists"));
	ejs.renderFile('./views/signup.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   //render or error
	   else {
	            res.end('An error occurred during rendering signup Page!');
	            console.log(err);
	   }
   });
}

exports.dosignup = function(req,res) {

	console.log("in dosignup");
	//request parameters
	var newUser = req.param("newUser");

	console.log(newUser);
	console.log("username :: " + newUser[0].username);

	//encypting the password instead of strogin the normal password
	var password = newUser[0].password;
	var hash = bcrypt.hashSync(password);

	var args = {
		username : "@" + newUser[0].username,
		password : hash,//sending the encrypted password
		firstname : newUser[0].firstname,
		lastname : newUser[0].lastname,
		email : newUser[0].email,
		gender : newUser[0].gender,
		birthdate : newUser[0].birthdate,
		contact : newUser[0].contact,
		location : newUser[0].location
	};
	
	var option = {ignoredNamespaces : true};

	var url = baseURL + "Home?wsdl";

	soap.createClient(url,option, function(err, client) {
		console.log("client start");
		//console.log(client);
		console.log("client end")

		client.dosignup(args, function(err, data) {
			if(err) {
				console.log("err :: " + err);
				var json_responses = {"statusCode" : 401, "error" : err};
			} else {
				console.log(data.dosignupReturn);
				res.send(JSON.parse(data.dosignupReturn));
			}
		});
	});
}

exports.checklogin = function (req,res) {

	console.log("in checklogin");

	var emailCheck = req.param("email");
	var passwordCheck = req.param("password");
	var json_responses;
	
	console.log("email :: " + emailCheck);
	console.log("password :: " + passwordCheck);

	if(emailCheck != '') {
		
		var args = {email : emailCheck, password : passwordCheck};
		var option = {ignoredNamespaces : true};

		var url = baseURL + "Home?wsdl";

		soap.createClient(url,option, function(err, client) {
		//console.log(err);
		//console.log(client);

			client.checkLogin(args,function(err,data){
				if(err){
					console.log("ERROR :: " + err);
					json_responses = {
						"statusCode" : 401,
						"error" : err
					}
					res.send(json_responses);
				}
				else{
					console.log("data :: " + data.checkLoginReturn);
					var dataParsed = JSON.parse(data.checkLoginReturn)
					console.log("statusCode :: " + dataParsed.statusCode);
					if(dataParsed.statusCode == 200) {
						if(bcrypt.compareSync(passwordCheck,dataParsed.password)) { //checking encrypted password
							req.session.username = dataParsed.username;
							console.log("emailCheck :: " + emailCheck);
							req.session.email = dataParsed.email;
							req.session.userid = dataParsed.userid;
						
							console.log("username :::: " + req.session.username);
							console.log("email :::: " + req.session.email);
							console.log("userid :::: " + req.session.userid);
						} else {
							res.send("statusCode : 401", "error" : "Unsuccessful Login");
						}
					}
					res.send(JSON.parse(data.checkLoginReturn));				
				}
			});	
		});
	}
}

exports.homepage = function(req, res) {
	
	console.log("username :: " + req.session.username);
	console.log("email :: " + req.session.email);
	console.log("userid :: " + req.session.userid);

	if(req.session!=null && req.session.username && req.session.email && req.session.userid) {
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

		//here all the data should be post
		res.render("homepage",{username : req.session.username, userid : req.session.userid,email : req.session.email});
	} else {
		res.redirect('/');
	}
}

exports.gettweetfollowerfollowingcount = function(req, res) {
	console.log("in home.gettweetfollowerfollowingcount node");

	if(req.session!=null && req.session.username && req.session.email && req.session.userid){
		var args = {email : req.session.userid};
		var option = {ignoredNamespaces : true};

		var url = baseURL + "Home?wsdl";

		soap.createClient(url,option, function(err, client) {
			client.gettweetfollowerfollowingcount(args,function(err,data){
				if(err){
					console.log("ERROR :: " + err);
					json_responses = {
						"statusCode" : 401,
						"error" : err
					}
					res.send(json_responses);
				}
				else{
					console.log("data :: " + data.gettweetfollowerfollowingcountReturn);
					res.send(JSON.parse(data.gettweetfollowerfollowingcountReturn));				
				}
			});	
		});
	} else
		res.redirect('/');
}

exports.logout = function(req,res) {
	console.log("in logout");
	req.session.destroy();
	
	res.redirect("/");
}

exports.viewprofile = function(req,res) {
	console.log("in view profile node");
	if(req.session.username && req.session.email && req.session.userid) {
		var email = req.session.email;
	
		console.log("email :: " + email);
	
		if(email != '') {
			res.render('viewprofile',{userid:req.session.userid, username:req.session.username, email : req.session.email});
		}
	} else{
		res.redirect("/");
	}
}