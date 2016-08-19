console.log("signup file loaded");

var signup = angular.module('signup',[]);

signup.controller('signup', function($scope, $filter, $http) {

	//$scope.emailExists = "";
	$scope.isEmailExist = false;
	$scope.isUsernameExist = false;
	console.log("outside submit button");
	$scope.submit = function() {
		
		//Initializing validation variables after clicking the submit button
		$scope.isEmailExist = false;
		$scope.isUsernameExist = false;
		$scope.unexpected_error = false;

		console.log("in submit funtion");
		$scope.emailExists = "";
		console.log("username :: " + $scope.username);
		console.log("email :: " + $scope.email);

		var newUser = [
			{
				"username" : $scope.username,
				"password" : $scope.password,
				"firstname" : $scope.firstname,
				"lastname" : $scope.lastname,
				"email" : $scope.email,
				"gender" : $scope.gender,
				"birthdate" : $filter('date')($scope.birthdate, 'yyyy-MM-dd'),
				"contact" : $scope.contact,
				"location" : $scope.location
			}
		];
		console.log("newUser");
		console.log(newUser);

		$http({
			method : "POST",
			url : '/dosignup',
			data : {
				"newUser" : newUser
			}
		}).success(function(data) {
			
			console.log("data :: " + data);
			//checking the response data for statusCode
			if(data.statusCode == 200) {
				console.log(data);

				if(data.isEmailExist) {
					if(data.isUsernameExist) {
						$scope.isEmailExist = true;
						$scope.isUsernameExist = true;

					}
					else if(!data.isUsernameExist)
						$scope.isEmailExist = true;
				}else if(!data.isEmailExist) {
					if(data.isUsernameExist) {
						$scope.isUsernameExist = true;
					}
				}

			}
			else if(data.statusCode == 401) {
				console.log("statusCode = 401");
				window.location.assign("/");
			}
		}).error(function(error) {
			$scope.unexpected_error = true;
		});
	};
});