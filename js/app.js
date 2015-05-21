(function(){

angular.module('contractorsApp', [])

.service('DataService', ['$rootScope', function($rootScope){
	var service = {
		contractors : [],
		addContractor : function (args) {
			service.contractos.push(args);
		},
	};
	return service;
}])

.service('ResizeService', ['$rootScope', '$document', '$window', function($rootScope, $document, $window) {
	var service = {
		w:	0,
		h:	0
	};
	
	var onResize = function() {
		service.w = $document[0].body.clientWidth;
		service.h = $window.innerHeight;
		
		$rootScope.$broadcast('event.resize', {
			w:	service.w,
			h:	service.h 
		});
	};
	
	angular.element($window).bind('resize', onResize);
	onResize();
	
	return service;
}])

.controller('BodyController', ['$scope', 'ResizeService', function($scope, ResizeService){
	var self = this;
	
	this.menuStyle = {};
	this.contaierStyle = {};
	this.isShort = false;
	
	this.onResize = function(){
		var w = ResizeService.w;
		var h = ResizeService.h;

		if(w < h || (w > h && h > 480)) {
			// top
			self.menuStyle = {
				width: 	w + 'px',
				height: '30px',
				float: 'none'
			};
			self.mainStyle = {
				width: 	w + 'px',
				height: (h-30) + 'px',
				float: 'none'
			};
			self.isShort = w < 400;
		} else {
			// side
			self.menuStyle = {
				width: 	'30px',
				height: h + 'px',
				float: 'left'
			};
			self.mainStyle = {
				width: 	(w-30) + 'px',
				height: h + 'px',
				float: 'left'
			};
			self.isShort = true;
		}
		
		if(!$scope.$$phase) {
			$scope.$apply();
		}	
	};
	
	$scope.$on('event.resize', this.onResize); 
	this.onResize();
}]);

})();
