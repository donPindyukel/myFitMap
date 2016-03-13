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