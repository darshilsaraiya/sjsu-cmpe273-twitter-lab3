console.log("in userResultsSearch.js");

var userResultsSearch = angular.module('userResultsSearch',['ngRoute']);

userResultsSearch.controller('userResultsSearch', function($scope, $http, $route) {

	$http({
		method : 'GET',
		url : "/searchUser"
	}).success(function(data) {
		console.log("in searchUser success");
		console.log(data.searchresult);
		console.log(data.statusCode);
		console.log(data);

		if(data.statusCode == 401) {
			console.log("searchUser--statusCode == 401");
		}
		else if(data.statusCode == 200) {
			console.log("searchUser--statusCode == 200");

			//setting the search results' data
			$scope.userid = data.userid;
			$scope.username = data.username;
			$scope.searchresult = data.searchresult;
			$scope.searchUsername = data.searchUsername;
			//setting current user's following list
			$scope.currentuserfollowing = data.currentuserfollowing;
			$scope.isFollowing = new Array();
			console.log("searchresult :: " + data.searchresult);
			if($scope.searchresult.length > 0) {
				//var index = 0;
				for(indexSearch in data.searchresult) {
					console.log("search.userid :: " + data.searchresult[indexSearch].userid);
					$scope.isFollowing[indexSearch] = false;
					for(indexFollowing in data.currentuserfollowing) {
						//console.log("following.userid :: " + data.currentuserfollowing[index].followingid);
						if(data.currentuserfollowing[indexFollowing].followingid == data.searchresult[indexSearch].userid) {
							$scope.isFollowing[indexSearch] = true;
							console.log("following.userid :: " + data.currentuserfollowing[indexFollowing].followingid);
						}
					}

					console.log("isFollowing :: " + $scope.isFollowing[indexSearch]);
				}
			} else {
				$scope.searchresult = null;
			}
		}
	}).error(function(error) {
		console.log("in searchUser error");
		console.log(error);
	});

	console.log("before getFollowing call");

	$scope.viewprofile = function() {
		console.log("in view profile angular controller");
		window.location.assign('/viewprofile');
	};

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
				}
			}
		}
	};

	$scope.follow = function(clickedFollowingId, isFollowing) {
		console.log("in follow function");
		
		console.log("clickedFollowingId :: " + clickedFollowingId);
		console.log("isFollowing :: " + isFollowing);
		if(isFollowing){
			$http({
				method : 'POST',
				url : '/deletefollowing',
				data : {
					deletefollowingid : clickedFollowingId
				}
			}).success(function(data){
					console.log("in success of delete following user");
					console.log(data);
					if(data.statusCode == 401) {
						console.log("in statusCode=401");
						window.alert("ERROR!");
					}
					else if(data.statusCode == 200) {
						console.log("in statusCode=200");
						var loc = window.location.toString();
						console.log(loc);
						var locationString = loc.split("localhost:3000");
					   	console.log(locationString[1]);
					   	window.location.assign(locationString[1]);	
					}
			}).error(function(error){
				console.log("in error of delete following user");
			});
		} else {
			$http({
				method : 'POST',
				url : '/insertfollowing',
				data : {
					insertfollowingid : clickedFollowingId
				}
			}).success(function(data){
					console.log("in success of insert following user");
					console.log(data);
					if(data.statusCode == 401) {
						console.log("in statusCode=401");
						window.alert("ERROR!");
					}
					else if(data.statusCode == 200) {
						console.log("in statusCode=200");
						var loc = window.location.toString();
						console.log(loc);
						var locationString = loc.split("localhost:3000");
					   	console.log(locationString[1]);
					   	window.location.assign(locationString[1]);	
					}
			}).error(function(error){
				console.log("in error of insert following user");
			});
		}
	}
});