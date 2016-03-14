/*;(function(){

	angular.module("fitfire",[])
		.factory('fitfire', fitfireFactory);

	fitfireFactory.$inject = ["FIREBASE_URL","$firebaseAuth","$firebaseObject","$rootScope"];
	function fitfireFactory (FIREBASE_URL,$firebaseAuth,$firebaseObject,$rootScope) {

		var ref = new Firebase(FIREBASE_URL);
		var dataObj = $firebaseObject(ref);

		var fitfireObj = {

			updateUser: function(_user) {
				console.log(_user);
			}

		}

		return fitfireObj


	}

})();*/