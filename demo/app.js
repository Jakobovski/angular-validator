angular.module('angular-validator-demo', ['angularValidator']);


angular.module('angular-validator-demo').controller('DemoCtrl',function($scope){

	$scope.submitMyForm = function(){
		alert("Form submitted");
	};

	$scope.myCustomValidator = function(text){		
		return true;
	};


	$scope.anotherCustomValidator = function(text){
		if(text === "rainbow"){
			return true;
		}
		else return "type in 'rainbow'";
	};

	$scope.passwordValidator = function(password) {

		if(!password){return;}
		
		if (password.length < 6) {
			return "Password must be at least " + 6 + " characters long";
		}

		if (!password.match(/[A-Z]/)) {
			 return "Password must have at least one capital letter";
		}

		if (!password.match(/[0-9]/)) {
			 return "Password must have at least one number";
		}

		return true;
	};



});