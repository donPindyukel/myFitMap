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
	                        "MyFitMap.exercises",
	                        "Authorize",
	                        "fitfire",
	                        "firebase",
	                        "ng-uploadcare"
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
       					if( ($location.url() === "/") ||
       						($location.url() === "/about") ||
       						($location.url() === "/contact")  ) {
       					
       							$location.path("/profile");
       					}
       					//console.log("$rootScope.currentUser!!!!!!!!!!!!!!!!!");
       				});
       				       				 
  				} else {
    				$rootScope.currentUser = null;
  				}
			 }
			
 		     var usersArr = $firebaseArray(usersRef);

 		     auth.$onAuth(authDataCallBack);

			 var authObj = {

			 	register: function (_user) {
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

	fitfireFactory.$inject = ["Authorization","$rootScope","$firebaseObject","$firebaseArray"];
	function fitfireFactory (Authorization,$rootScope,$firebaseObject,$firebaseArray) {

		var auth = Authorization.getAuth();
		var ref = Authorization.grtRefDb();
		var fitfireObj = {

			changePass: function (pass) {
			 		return auth.$changePassword(pass);

			 	},

			changeEmail: function (email) {
					return auth.$changeEmail(email);
			},

			exerciseCreate: function (exercise) {
				var exercisesGroup = $firebaseArray(ref.child("exercises/"+exercise.groupExers.id));
				exercisesGroup.$add({
						       name: exercise.name,
						description: exercise.description,
							  video: exercise.video,
						  author_id: $rootScope.currentUser.$id,
						date_create: Firebase.ServerValue.TIMESTAMP
				}).then(function(ref) {
  						var id = ref.key();
  						console.log("added record with id " + id);
  						exercisesGroup.$indexFor(id); // returns location in the array
					});
			},

			getDataExercises: function() {
				var exercisesTabl = $firebaseArray(ref.child("exercises"));
				return exercisesTabl.$loaded();
			}


		}

		return fitfireObj;


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

ContactCtrl.$inject = ["$scope","$rootScope","$http","$timeout","$q"];
function ContactCtrl($scope,$rootScope,$http,$timeout,$q) {
	console.log("ContactCtrl Start");
	var vm = this;
	vm.title = "Это страница с контактными данными";
	$rootScope.curPath = "contact";
	vm.cdnUrl = null;

	vm.uploadComplete = function (object) {
		//console.log (vm);
		vm.cdnUrl = object.cdnUrl;

	};
	
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
;(function(){
angular.module("directive.AddNewExercise",[])
	.directive("addNewExercise",AddNewExerciseDirective)
	.controller("AddNewExsCtrl", AddNewExercisesCtrl);

	AddNewExerciseDirective.inject = [];
	function AddNewExerciseDirective ( ){
		return {
			templateUrl: "app/directives/addNewExercises/addNewexercisesTemplate.html",
			restrict: "E",
			controller: "AddNewExsCtrl",
			controllerAs: "dirAddEx"
		}
	}

	AddNewExercisesCtrl.$inject = ["$scope", "$rootScope", "fitfireservice"];
	function AddNewExercisesCtrl ($scope,$rootScope,fitfireservice) {
		var vm = this;
		
		vm.exercisesGroup = [];
		vm.successNotif = false;
	
		fitfireservice.getDataExercises().then(function(data){
		for (var i = 0; i<data.length; i++){
			vm.exercisesGroup.push({
									name: data[i].name,
									id:data[i].$id 
								  });
		}
	});
	
	vm.userExerciseCreate = function (exercises) {
		fitfireservice.exerciseCreate(exercises);
	};
	}
})();	
;(function(){

	
	angular.module('MyFitMap.exercises', ["directive.AddNewExercise"])
	.config(ExercisesConfig)
	.controller('ExercisesCtrl',ExercisesCtrl);




ExercisesConfig.$inject = ["$routeProvider"];
function ExercisesConfig ($routeProvider) {
	console.log("Exercises config");
	$routeProvider
		.when("/exercises",{
			templateUrl:"/app/components/exercises/exercises.html",
			controller:"ExercisesCtrl",
			controllerAs:"exr",
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

ExercisesCtrl.$inject = ["$scope","$rootScope","Authorization","$sanitize","fitfireservice","$timeout","$location"];
function ExercisesCtrl($scope,$rootScope,Authorization,$sanitize,fitfireservice,$timeout,$location) {

	var vm = this;
	console.log("ExercisesCTRL start");
	$rootScope.curPath = "exercises";
	console.log("ExercisesCTRL finish");


}
})();