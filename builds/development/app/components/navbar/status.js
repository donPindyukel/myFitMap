;(function(){

	angular
		.module('MyFitMap.status',[])
		.controller('AuthCtrl', AuthController)
		.controller('StatusCtrl', StatusController);


	 AuthController.$inject = ['$scope',"Authorization","$timeout"];
	 function AuthController ($scope,Authorization,$timeout) {
	 	var vm = this;
	 //	vm.text = "dsgsd";
	 	vm.regMsgSuccsess = false;
	 	vm.regMsgError = false;
	 	vm.passErrorNotif = false;
	 	console.log("AuthController start");
	 	vm.newUser = {
	 		firstname:null,
	 		lastname:null,
	 		email:null,
	 		password:null,
	 		confPass:null
	 	};
	 	vm.credentails = {
					email:null,
					password:null
				};
	 	vm.register = function (){
	 		if (vm.newUser.password!=vm.newUser.confPass) {
	 			vm.newUser.password = null;
	 			vm.newUser.confPass = null;
	 			vm.passErrorNotif = true;
	 			return;
	 		}
	 		vm.passErrorNotif = false;
	 		Authorization.register(vm.newUser);
	 		angular.element("#close-regform").trigger("click");


	 	};
	 	vm.login = function (){
	 		//console.log(vm.credentails);
	 		Authorization.login(vm.credentails, function (authData) {
	 			if (authData.uid) { 
	 				vm.regMsgSuccsess = true;
	 				  $timeout(function () {
                   vm.regMsgSuccsess = false;
                }, 2000);

	 			} else {
	 				vm.regMsgError = true;
	 				  $timeout(function () {
                   vm.regMsgError = false;
                }, 2000);
            	}
	 		});
	 	};

	 };

	 StatusController.$inject = ['$scope',"Authorization","$location","$rootScope","$timeout"];
	 function StatusController ($scope,Authorization,$location,$rootScope,$timeout) {

	 	var vm = this;
	 	/*vm.photo = false;
	 	vm.nonPhoto = false;
	 	$timeout(function(){

	 	console.log($rootScope.currentUser.name);
	 	},3000);*/
		/*if($rootScope.currentUser.photo) {
			vm.photo = true;

		} else {
			vm.nonPhoto = true; 
		}	*/
	 	

	 };


})();