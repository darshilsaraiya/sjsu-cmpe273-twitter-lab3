console.log("in viewprofile controller");

var viewprofile = angular.module('viewprofile',['ngRoute']);

viewprofile.controller('viewprofile', function($scope, $http, $route, $location, $sce) {
	

	var searchHash = function(tag){
		console.log("tag :: " + tag);
		window.alert("This is clicked");
	}

	$scope.toTrustedHTML = function (html) {
    	return $sce.trustAsHtml(html);
  	};

	console.log("in view profile controller");

	//for doTweet
	var loc = window.location.toString();
	console.log(loc);
	var array = loc.split("localhost:3000");
    console.log(array[1]);

	$http({
		method : 'POST',
		url : '/getprofiledetails'
	}).success(function(data) {
		console.log("in success of getprofiledetails http method");
		console.log(data);
		if(data.statusCode==200) {
			//setting the profile data
			$scope.userid = data.data.userid;
			$scope.username=data.data.username;
			$scope.name=data.data.firstname + " " + data.data.lastname;
			$scope.email="Email : " + data.data.email;
			
			if(data.data.gender == '' || data.data.gender == null)
			{
				$scope.gender="Gender : Empty";	
			} else {
				$scope.gender="Gender : " + data.data.gender;
			}

			$scope.birthdate = null;
			$scope.location = null;
			$scope.contact = null;

			if(data.data.birthdate == '' || data.data.birthdate == null)
			{	
				$scope.birthdate = "Birthdate : Empty";
							
			} else {
				$scope.birthdate = "Birthdate : " + data.data.birthdate;
				console.log("birthdate :: " + $scope.birthdate);
			}

			if(data.data.location == '' || data.data.location == null) {
				 $scope.location = "Location : Empty";
			} else {
				$scope.location = "Location : " + data.data.location;
			}

			if(data.data.contact == '' || data.data.contact == null) {
				$scope.contact = "Contact : Empty";
			} else {
				$scope.contact = "Contact : " + data.data.contact;
			}
		}
		else if(data.statusCode==401) {
			console.log("ERROR :: statusCode=401");
		}

	}).error(function(error) {
		console.log("in error of getprofiledetails http method");
		console.log(error);
	});

	$http({
		method : 'POST',
		url : '/getUserTweetsDetails'
	}).success(function(data) {
		console.log("in get User tweets success");
		console.log(data);
		if(data.statusCode==200) {

			//setting the user tweets data
			$scope.userTweets = data.userTweets;

			for(var index = 0; index < data.userTweets.length; index++) {
				console.log("userid : " + $scope.userid);
				console.log("ownerid : " + data.userTweets[index].userid);
				console.log("tweet : " + data.userTweets[index].tweet);
			}
		}
		else if(data.statusCode==401) {
			console.log("ERROR :: statusCode=401");
			$scope.userTweets = null;
			/*$scope.tweets = data.userTweets;*/
		}

	}).error(function(error) {
		console.log("in get User tweets error");
		console.log(error);
	});

	

	$scope.doTweet = function() {
		
		console.log("Tweet is " + $scope.inputTweet);
		if($scope.inputTweet!='')
			$http({
				method : "POST",
				url : "/doTweet",
				data : {
					tweet : $scope.inputTweet
				}
			}).success( function(data) {
				console.log("in success of tweet");
				if(data.statusCode == 401) {
					console.log("in statusCode=401");
					window.alert("ERROR! Tweet is not posted! Please try again");
				}
				else if(data.statusCode == 200) {
					/*window.location.assign('/homepage');*/
					//window.loaction.reload();
					//$route.reload();
					var loc = window.location.toString();
					console.log(loc);
					var locationString = loc.split("localhost:3000");
				    console.log(locationString[1]);
				    window.location.assign(locationString[1]);
				}
			}).error(function(error) {
				console.log("in error of tweet");
				window.alert("ERROR! Tweet can not be posted! Please try again");
			})
		};

	$scope.search = function() {
		console.log("in search Function");

		var searchStr = $scope.inputSearch.toString();

		console.log("searchString :: " + searchStr);

		if(searchStr.length>0) {
			if(searchStr.charAt(0)!= '#'){ //Search String is a user Search
				console.log("in user search");
				console.log("searchString:" + searchStr);
				
				$http({
				method : "GET",
				url : "/userSearchResults",
				params : {
					searchUsername : searchStr
					}
				}).success( function(data) {
					console.log("in success of search");
					console.log(data);
					if(data.statusCode == 401) {
						console.log("in statusCode=401");
						window.alert("ERROR!");
					}
					else if(data.statusCode == 200) {
						console.log("in statusCode=200");
						window.location.assign("/usrSearchResults");
					}
				}).error(function(error) {
					console.log("in error of search");
					console.log(error);
				});

				//window.location.assign("/userSearchResults/?searchUsername=" + searchStr);
			}
			else {//Search String is HashTag Search
				if(searchStr.length>1){
					console.log("in hashtag search");

					var searchHash = searchStr.split("#")[1];

					$http({
						method : 'GET',
						url : '/searchHashTag',
						params : {
							hashtag : searchHash
						}
					}).success(function(data) {
						
						console.log(data);
						if(data.statusCode == 401) {
							console.log("in statusCode=401");
							window.alert("ERROR!");
						}
						else if(data.statusCode == 200) {
							console.log("in statusCode=200");
							window.location.assign("/srcHashTag");
						}
					}).error(function(error) {
						console.log("in error hashtag search");
						console.log(error);
					});
					//window.location.assign("/hashtagSearchResults/?hashtag=" + searchString);
				}
			}
		}
	};
});