(function(){

angular.module('contractorsApp', [])

.controller('BodyController', ['$scope', '$document', '$window', function($scope, $document, $window){

	var self = this;

	this.menuStyle = {};
	this.contaierStyle = {};
	this.isShort = false;

	//socket.connect('https://sand.geocom.pro:8056', { query: 'sessionID=sesja1' });

	this.onResize = function() {

			var w = self.windowWidth = 	$document[0].body.clientWidth;
			var h = self.windowHeight = $window.innerHeight;

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
	}

	angular.element($window).bind('resize', this.onResize);
	this.onResize();

}]);

})();
