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
			controllerAs:"prf",
			resolve: {
				curentLoad: waitForLoadUserData 
			}
		});
}

waitForLoadUserData.$inject = ["Authorization","$rootScope","$q"];
function waitForLoadUserData (Authorization,$rootScope,$q){
		var deferred = $q.defer();
		var curUser = Authorization.getCurUserData();
		curUser.$loaded(function(_user) {
			$rootScope.currentUser = _user;
			deferred.resolve();
		});
		return deferred.promise;
}

ProfileCtrl.$inject = ["$scope","$rootScope","Authorization","$sanitize","fitfireservice","$timeout"];
function ProfileCtrl($scope,$rootScope,Authorization,$sanitize,fitfireservice,$timeout) {
	console.log("ProfileCtrl Start");
	var vm = this;
	$rootScope.curPath = "profile";
	vm.pass={};
	vm.email={};
	vm.successNotif = false;
	vm.emailSuccessNotif = false;
	vm.passSuccessNotif = false;
	vm.emailErrorNotif = false;
		
	vm.cancel = function() {
		vm.userData = {};
		vm.userData.name = $rootScope.currentUser.name;
		vm.userData.email = $rootScope.currentUser.email;
		vm.userData.growth = $rootScope.currentUser.growth;
		vm.userData.weight = $rootScope.currentUser.weight;
		vm.userData.birthDay = new Date($rootScope.currentUser.birthDay);
	};


	vm.cancel();

	vm.state = "userdata";
   
	vm.refresh = function(){
		vm.cancel();
		vm.email = {};
		vm.pass={};
	};

	if ($rootScope.currentUser.photo) vm.photo = 1;
	else vm.photo = 0;

	vm.userUpdate = function(_user) {
		angular.element("#userDataForm").val("");

		$rootScope.currentUser.name = $sanitize(_user.name);
		$rootScope.currentUser.email = $sanitize(_user.email);
		$rootScope.currentUser.growth = _user.growth;
		$rootScope.currentUser.weight = _user.weight;
		$rootScope.currentUser.birthDay = Date.parse(_user.birthDay);


		$rootScope.currentUser.$save().then(function(usr){
			vm.successNotif = true;
			$timeout(function(){
				vm.successNotif = false;
			},2000);
		},function(error){
			console.log(error);

		});

	};


	vm.changePass = function(pass) {
			var psw = {
				email:$rootScope.currentUser.email,
				oldPassword:pass.oldPassword,
				newPassword:pass.newPass
			};
			
			var promise = fitfireservice.changePass(psw);
			promise.then(function(){
				vm.passSuccessNotif = true;
				$timeout(function(){
					vm.passSuccessNotif = false;
				}, 2000);
			})
			.catch(function(error){
				vm.passErrorNotif = true;
				$timeout(function(){
					vm.passErrorNotif = false;
				}, 2000);
			});

	};

	vm.changeEmail = function(email) {
		var emailChangeData = {
				oldEmail: email.oldEmail,
  				newEmail: email.newEmail,
  				password: email.confirmPass
		};
		

		var promise = fitfireservice.changeEmail(emailChangeData);
			promise.then(function(){
				$rootScope.currentUser.email = $sanitize(emailChangeData.newEmail);
				$rootScope.currentUser.$save();
				vm.emailSuccessNotif = true;
				$timeout(function(){
					vm.emailSuccessNotif = false;
				}, 2000);

			})
			.catch(function(error){
				vm.emailErrorNotif = true;
				$timeout(function(){
					vm.emailErrorNotif = false;
				}, 2000);

			});
	};

	vm.widReady = function(photoLink){
	//	console.log(photoLink);
		$rootScope.currentUser.photo = photoLink.cdnUrl;
		$rootScope.currentUser.$save().then(function(){
			console.log("photo saved");
		},function(){
			console.log("error");
		});
	};

	vm.avatarDelete = function () {
		vm.widReady("");


	};	


}
})();