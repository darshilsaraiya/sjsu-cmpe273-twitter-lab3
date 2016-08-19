console.log("in homepage.js");

var homepage = angular.module('homepage',['ngRoute']);

homepage.controller('homepage', function($scope, $http, $route,  $sce) {

	$scope.toTrustedHTML = function (html) {
    	return $sce.trustAsHtml(html);
  	};

	//get Tweet, Follower, Following Count
	$http({
		method : "POST",
		url : "/gettweetfollowerfollowingcount",
	}).success(function(data) {
		console.log("in getTweetFollowerFollowingCount success");
		console.log(data);
		if(data.statusCode==200) {
			console.log("statusCode==200");
			console.log("Tweet Count :: " + data.tweetcount);
			console.log("Follower Count :: " + data.followercount);
			console.log("Following Count :: " + data.followingcount);

			$scope.tweetcount = "Tweets : " + data.tweetcount;
			$scope.followingcount = "Following : " + data.followingcount;
			$scope.followercount = "Followers : " + data.followercount;
		}
		else if(data.statusCode == 401) {
			console.log("statusCode=401");
		}
	}).error(function(error) {
		console.log("in getTweetFollowerFollowingCount Error");
	});

	//get following users' tweets
	$http({
		method : 'POST',
		url : '/getfollowingtweets'
	}).success(function(data) {
		
		console.log("in getfollowingtweets success");
		console.log(data);
		if(data.statusCode==200) {
			console.log(data.followingTweets);

			$scope.followingTweets = data.followingTweets;
			$scope.userRetweets = data.userRetweets;

			$scope.isRetweeted = new Array();

			for(var index = 0; index < data.followingTweets.length; index++) {
				console.log("username :: " + data.followingTweets[index].username);
				console.log("tweetid :: " + data.followingTweets[index].tweetid);
				console.log("tweet :: " + data.followingTweets[index].tweet);
				console.log("time :: " + data.followingTweets[index].time);
			}

			for(var index = 0; index < data.userRetweets.length; index++) {
				console.log("tweetid :: " + data.userRetweets[index].tweetid);
				console.log("ownerid :: " + data.userRetweets[index].ownerid);
				console.log("retweeterid :: " + data.userRetweets[index].retweeterid);
			}

			for(var indexFollowingTweet = 0; indexFollowingTweet < data.followingTweets.length; indexFollowingTweet++) {
				$scope.isRetweeted[indexFollowingTweet] = false;
				for(var indexRetweet = 0; indexRetweet < data.userRetweets.length; indexRetweet++) {
					/*console.log("followingTweets.tweetid :: " + data.followingTweets[indexFollowingTweet].tweetid);
					console.log("userTweets.tweetid :: " + data.userRetweets[indexRetweet].tweetid);*/
					if(data.followingTweets[indexFollowingTweet].tweetid == data.userRetweets[indexRetweet].tweetid) {
						$scope.isRetweeted[indexFollowingTweet] = true;
						continue;

					}
				}
				console.log("followingTweets.tweetid :: " + data.followingTweets[indexFollowingTweet].tweetid);
				console.log("isRetweeted :: " + indexFollowingTweet + " :: " + $scope.isRetweeted[indexFollowingTweet]);
			}
		} else if(data.statusCode==401) {
			console.log("ERROR :: statusCode=401");
			$scope.followingTweets = null;
			$scope.userRetweets = null;
		}
	}).error(function(error) {
		console.log("in getfollowingtweets error");
	});

	//$scope.retweet = function(followingusername, tweetstring, tweetid, tweetdate, isRetweeted) {
	$scope.retweet = function(retweetid, isRetweeted) {
		console.log("in retweet function");

		console.log("isRetweeted :: " + isRetweeted);
		console.log("retweetid :: " + retweetid);
		
		if(isRetweeted) {
			$http({
				method : "POST",
				url : '/deleteretweet',
				data : {
					"retweetid" : retweetid
				}
			}).success(function(data) {
				console.log("in success of delete retweet");
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
			}).error(function(error) {
						console.log("in error of delete retweet user");
			});
		} else {
			$http({
				method : "POST",
				url : '/insertretweet',
				data : {
					"retweetid" : retweetid
				}
			}).success(function(data) {
				console.log("in success of insert retweet");
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
			}).error(function(error) {
						console.log("in error of insert retweet user");
			});
		}
	}

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
				console.log(error);
				window.alert("ERROR! Tweet can not be posted! Please try again");
			});
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
})