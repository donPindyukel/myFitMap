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