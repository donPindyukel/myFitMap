;(function(){

	angular.module('MyFitMap.profile', ["ngSanitize"])
	.config(ProfileConfig)
	.controller('ProfileCtrl',ProfileCtrl);



ProfileConfig.$inject = ["$routeProvider"];
function ProfileConfig ($routeProvider) {
	console.log("Profile config");
	$routeProvider
		.when("/profile",{
			templateUrl:"/app/components/profile/profile.html",
			controller:"ProfileCtrl",
			controllerAs:"prf"
		});
};

ProfileCtrl.$inject = ["$scope","$rootScope","Authorization","$sanitize"];
function ProfileCtrl($scope,$rootScope,Authorization,$sanitize) {
	console.log("ProfileCtrl Start");
	var vm = this;
	vm.title = "Это страница профиля";
	$rootScope.curPath = "profile";

	vm.pass={}
		
	vm.cancel = function() {
		vm.userData = {};
		vm.userData.name = $rootScope.currentUser.name;
		vm.userData.email = $rootScope.currentUser.email;
		vm.userData.growth = $rootScope.currentUser.growth;
		vm.userData.weight = $rootScope.currentUser.weight;
		vm.userData.birthDay = new Date($rootScope.currentUser.birthDay);
	}


	vm.cancel();

	vm.state = "userdata";

	if ($rootScope.currentUser.photo) vm.photo = 1;
	else vm.photo = 0;

	vm.userUpdate = function(_user) {
	
		$rootScope.currentUser.name = $sanitize(_user.name);
		$rootScope.currentUser.email = $sanitize(_user.email);
		$rootScope.currentUser.growth = _user.growth;
		$rootScope.currentUser.weight = _user.weight;
		$rootScope.currentUser.birthDay = Date.parse(_user.birthDay);


		$rootScope.currentUser.$save().then(function(usr){
			console.log(usr.key());
		},function(error){
			console.log(error);

		});

	}


	vm.changePass = function(pass) {
		
		if ((pass.newPass == undefined) || 
			(pass.confirmPass == undefined) ||
			(pass.oldPassword == undefined) ||
			(pass.newPass!=pass.confirmPass) ||
			(pass == undefined)) {
				console.log("повторите ввод");
				vm.pass.newPass = undefined;
				vm.pass.confirmPass = undefined;
				vm.pass.oldPassword = undefined;
				return;
		} else {
			var psw = {
				email:$rootScope.currentUser.email,
				oldPassword:pass.oldPassword,
				newPassword:pass.newPass
			}
			
			Authorization.changePass(psw);
		}

	}

		

	
}

})();