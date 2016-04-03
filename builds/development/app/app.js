"use strict"
// initialize material design js
$.material.init();

;(function(){

angular.module('MyFitMap', ["ngRoute",
	                        "MyFitMap.main",
	                        "MyFitMap.about",
	                        "MyFitMap.contact",
	                        "MyFitMap.status",
	                        "MyFitMap.profile",
	                        "MyFitMap.exercises",
	                        "Authorize",
	                        "fitfire",
	                        "firebase",
	                        "ng-uploadcare"
	                         ])
.config(MyFitMapConfig)
.constant("FIREBASE_URL", "https://myfitmap.firebaseio.com/");

MyFitMapConfig.$inject = ["$routeProvider"];
function MyFitMapConfig($routeProvider) {
	console.log("Config app");
	$routeProvider
		.otherwise({redirectTo:'/'});
}


})();
