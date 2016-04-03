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