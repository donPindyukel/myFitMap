"use strict"
// initialize material design js
$.material.init();

;(function(){

angular.module('MyFitMap', ["ngRoute",
	                        "MyFitMap.main",
	                        "MyFitMap.about",
	                        "MyFitMap.contact",
	                        "MyFitMap.status",
	                        "Authorize",
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

		AuthorizeFactory.$inject = ["FIREBASE_URL","$firebaseAuth","$firebaseArray","$firebaseObject","$rootScope"];
		function AuthorizeFactory (FIREBASE_URL,$firebaseAuth,$firebaseArray,$firebaseObject,$rootScope){
			 console.log("Auth Factory");
			 var ref = new Firebase(FIREBASE_URL);
			 var usersRef = ref.child('users');
			 var auth = $firebaseAuth(ref);

			 function authDataCallBack(authData) {

			 	if (authData) {
       				var curUserRef = usersRef.child(authData.uid);
       				var curUser = $firebaseObject(curUserRef);
       				curUser.$loaded(function(_user){
       					$rootScope.currentUser = _user;
       				});
       				       				 
  				} else {
    				$rootScope.currentUser = null;
  				}
			 }
			
 		     var usersArr = $firebaseArray(usersRef);

 		     auth.$onAuth(authDataCallBack);

			 var authObj = {

			 	register: function (_user) {
			 			//console.log(auth);
			 		return auth.$createUser({
			 			email:_user.email,
			 			password:_user.password
			 		}).then(function(userData){
			 			console.log("User " + userData.uid + " created successfully!");
			 			var userRef = ref.child("users").child(userData.uid);
						userRef.set({
							firstname:_user.firstname,
							lastname:_user.lastname,
							email:_user.email,
							date:Firebase.ServerValue.TIMESTAMP
			 	
			 		     });
						return auth.$authWithPassword({
							email:_user.email,
							password:_user.password
						});
					}).catch(function(error){
						$log.error("Create user error", error);
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
			 	}

			 };

			$rootScope.signedIn = function () {
				return authObj.signedIn();
			};

			return authObj;
		};


})();
/**
 * Created by szaharov on 28/05/15.
 */

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

/**
 * Created by szaharov on 28/05/15.
 */

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
	 		lastName:null,
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

	 StatusController.$inject = ['$scope',"Authorization"];
	 function StatusController ($scope,Authorization) {

	 	var vm = this;
	 	vm.logout = function(){
	 		Authorization.logout();
	 	}

	 };


})();