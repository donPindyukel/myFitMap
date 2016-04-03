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