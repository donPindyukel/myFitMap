"use strict"
// initialize material design js
$.material.init();

;(function(){

angular.module('MyFitMap', ["ngRoute",
	                        "MyFitMap.main",
	                        "MyFitMap.about",
	                        "MyFitMap.contact",
	                        "MyFitMap.status",
	                        "MyFitMap.profile",
	                        "Authorize",
	                        "fitfire",
	                        "firebase"

	                         ])
.config(MyFitMapConfig)
.constant("FIREBASE_URL", "https://myfitmap.firebaseio.com/");

MyFitMapConfig.$inject = ["$routeProvider"];
function MyFitMapConfig($routeProvider) {
	console.log("Config app");
	$routeProvider
		.otherwise({redirectTo:'/'});
}


})();

;(function(){

	angular.module("Authorize",[])
		.factory('Authorization', AuthorizeFactory);

		AuthorizeFactory.$inject = ["$q","FIREBASE_URL","$firebaseAuth","$firebaseArray","$firebaseObject","$rootScope","$location"];
		function AuthorizeFactory ($q,FIREBASE_URL,$firebaseAuth,$firebaseArray,$firebaseObject,$rootScope,$location){
			 console.log("Auth Factory");
			 var ref = new Firebase(FIREBASE_URL);
			 var usersRef = ref.child('users');
			 var auth = $firebaseAuth(ref);
			 var usr;
			 function authDataCallBack(authData) {

			 	if (authData) {
       				var curUserRef = usersRef.child(authData.uid);
       				var curUser = $firebaseObject(curUserRef);
       				curUser.$loaded(function(_user){
       					$rootScope.currentUser = _user;
       					$location.path("/profile");
       					console.log("$rootScope.currentUser!!!!!!!!!!!!!!!!!");
       				});
       				       				 
  				} else {
    				$rootScope.currentUser = null;
  				}
			 }
			
 		     var usersArr = $firebaseArray(usersRef);

 		     auth.$onAuth(authDataCallBack);

			 var authObj = {

			 	register: function (_user) {
			 			console.log(_user);
			 		return auth.$createUser({
			 			email:_user.email,
			 			password:_user.password
			 		}).then(function(userData){
			 			console.log("User " + userData.uid + " created successfully!");
			 			var userRef = ref.child("users").child(userData.uid);
						userRef.set({
							name:_user.firstname + " " +_user.lastname,
							email:_user.email,
							date:Firebase.ServerValue.TIMESTAMP
			 	
			 		     });
						return auth.$authWithPassword({
							email:_user.email,
							password:_user.password
						});
					}).catch(function(error){
						console.log("Create user error", error);
					});

			 	},

			 	show: function(cb){
			 		return usersArr.$loaded(cb);
			 	},

			 	signedIn: function(){
			 		var authData = auth.$getAuth();
			 		if(authData) return true;
			 		return false;
			 	},

			 	login: function(loginUser, cb){

			 		auth.$authWithPassword(loginUser)
			 			.then(cb)
                    	.catch(cb);
			 	},

			 	logout: function() {

			 		auth.$unauth();
			 	},

			 	getAuth: function() {
			 		return auth;
			 	},

			 	grtRefDb: function() {
			 		return ref;
			 	},

			 	getCurUserData: function() {

					var authData = auth.$getAuth();
					var curUserRef = usersRef.child(authData.uid);
					var curUser = $firebaseObject(curUserRef);
					return curUser;
			 	}


			 };

			$rootScope.signedIn = function () {
				return authObj.signedIn();
			};

			$rootScope.logout = function (){

	 			authObj.logout();
	 			$rootScope.currentUser = null;
	 			var url = $location.path("");

	 		

			}

			return authObj;
		};


})();
;(function(){

	angular.module("fitfire",[])
		.factory('fitfireservice', fitfireFactory);

	fitfireFactory.$inject = ["Authorization"];
	function fitfireFactory (Authorization) {

		var auth = Authorization.getAuth();
		var fitfireObj = {

			changePass: function (pass) {
			 		return auth.$changePassword(pass);

			 	},

			changeEmail: function (email) {
					return auth.$changeEmail(email);
			}

		}

		return fitfireObj


	}

})();
;(function(){

angular.module('MyFitMap.about', [])
.config(MyFitMapAboutCnf)
.controller('AboutCtrl', AboutCtrl);


MyFitMapAboutCnf.$inject = ["$routeProvider"];
function MyFitMapAboutCnf ($routeProvider) {
	console.log("About config");
	$routeProvider
		.when("/about",{
			templateUrl:"/app/components/about/about.html",
			controller:"AboutCtrl",
			controllerAs:"abt"
		})
};

AboutCtrl.$inject = ["$scope","$rootScope"];
function AboutCtrl($scope,$rootScope) {
	console.log("AboutCtrl Start");
	var vm = this;
	vm.title = "Это страница с информацией о нас";
	$rootScope.curPath = "about";
	console.log("AboutCtrl Finish");
}

})();
;(function(){

angular.module('MyFitMap.contact', [])
.config(MyFitMapContactCnf)
.controller('ContactCtrl', ContactCtrl);


MyFitMapContactCnf.$inject = ["$routeProvider"];
function MyFitMapContactCnf ($routeProvider) {
	console.log("Contact config");
	$routeProvider
		.when("/contact",{
			templateUrl:"/app/components/contact/contact.html",
			controller:"ContactCtrl",
			controllerAs:"cnt"
		})
};

ContactCtrl.$inject = ["$scope","$rootScope"];
function ContactCtrl($scope,$rootScope) {
	console.log("ContactCtrl Start");
	var vm = this;
	vm.title = "Это страница с контактными данными";
	$rootScope.curPath = "contact";
	console.log("ContactCtrl Finish");
}

})();
;(function(){

angular.module('MyFitMap.main', [])
.config(MyFitMapMainCnf)
.controller('MainCtrl', MainCtrl);


MyFitMapMainCnf.$inject = ["$routeProvider"];
function MyFitMapMainCnf ($routeProvider) {
	console.log("Main config");
	$routeProvider
		.when("/",{
			templateUrl:"/app/components/main/main.html",
			controller:"MainCtrl",
			controllerAs:"mc"
		})
};

MainCtrl.$inject = ["$scope","$rootScope","Authorization"];
function MainCtrl($scope,$rootScope,Authorization) {
	console.log("MainCtrl Start");
	
	var vm = this;
	vm.title = "Это главная страница";
	$rootScope.curPath = "home";

	vm.show = function (){
		Authorization.show(function(_d){
			vm.users = _d;
		});
	}

	console.log("MainCtrl Finish");
}

})();

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
	 	console.log("AuthController start");
	 	vm.newUser = {
	 		firstname:null,
	 		lastname:null,
	 		email:null,
	 		password:null
	 	};
	 	vm.credentails = {
					email:null,
					password:null
				};
	 	vm.register = function (){

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

ProfileCtrl.$inject = ["$scope","$rootScope","Authorization","$sanitize","fitfireservice","$timeout" ];
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

	
}

})();