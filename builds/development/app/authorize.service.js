;(function(){

	angular.module("Authorize",[])
		.factory('Authorization', AuthorizeFactory);

		AuthorizeFactory.$inject = ["FIREBASE_URL","$firebaseAuth","$firebaseArray","$firebaseObject","$rootScope","$location"];
		function AuthorizeFactory (FIREBASE_URL,$firebaseAuth,$firebaseArray,$firebaseObject,$rootScope,$location){
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
       					$location.path("");
       					$location.path("profile");
       					//console.log($rootScope.currentUser);
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

			 	changePass: function (pass) {
			 		auth.$changePassword(pass)
			 			.then(function() {
  							console.log("Password changed successfully!");
					    }).catch(function(error) {
  								console.error("Error: ", error);
						});

			 	}

			 };

			$rootScope.signedIn = function () {
				return authObj.signedIn();
			};

			$rootScope.logout = function (){

	 			authObj.logout();
	 			var url = $location.path("");
	 		

			}

			return authObj;
		};


})();