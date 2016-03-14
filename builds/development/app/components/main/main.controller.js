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
