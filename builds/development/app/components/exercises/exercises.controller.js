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