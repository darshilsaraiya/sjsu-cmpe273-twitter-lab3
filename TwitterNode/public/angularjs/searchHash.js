console.log("in searchHash.js");

var searchHash = angular.module('searchHash',['ngRoute']);

searchHash.controller('searchHash', function($scope, $http, $route, $sce) {

	$scope.toTrustedHTML = function (html) {
    	return $sce.trustAsHtml(html);
  	};

	console.log("scope.userid :: " + $scope.userid);
	console.log(window.useridScript);
	console.log(window.searchUsername);

	$http({
		method : 'GET',
		url : "/searchHash",
		params : {
			searchHash : window.searchHash
		}
	}).success(function(data) {
		console.log("in searchHash success");
		console.log(data.results);
		console.log(data.statusCode);
		console.log(data);

		if(data.statusCode == 401) {
			console.log("searchHash--statusCode == 401");
			$scope.results=null;
		}
		else if(data.statusCode == 200) {
			console.log("searchHash--statusCode == 200");
			
			$scope.results = data.results;
		}
	}).error(function(error) {
		console.log("in searchUser error");
		console.log(error);
	});

	console.log("before getFollowing call");

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
			else {
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
	}
});
