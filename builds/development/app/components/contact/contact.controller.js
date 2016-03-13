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

ContactCtrl.$inject = ["$scope","$rootScope"];
function ContactCtrl($scope,$rootScope) {
	console.log("ContactCtrl Start");
	var vm = this;
	vm.title = "Это страница с контактными данными";
	$rootScope.curPath = "contact";
	console.log("ContactCtrl Finish");
}

})();