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