(function(){

angular.module('contractorsApp', [])

// Service for data handling and communication with back-end
.service('DataService', ['$rootScope', function($rootScope){
	
	// commands used in client-server communication	
	var CMD_LOGIN = 		'login',
		CMD_GET_LIST = 		'CRM.query.getOrganizationList';
	
	
	// service variables and methods
	var service = {
		isConnected:	false,
		isLoggedIn:		false,
		contractors : 	[],
		addContractor : function (args) {
			service.contractos.push(args);
		},
		login: function(login, password){
			sendCommand(CMD_LOGIN, { login:login, password:password });	
		},
		getList:	function(){
			sendCommand(CMD_GET_LIST);
		}
	};
	
	// connection to socket
	var socket = io.connect('https://sand.geocom.pro:8056', { query: 'sessionID=sesja1' });
	var onConnected = function() {
		service.isConnected = true;
		$rootScope.$broadcast('event.connected');
	};
	socket.on('connect', onConnected);
	
	// commands execution methods
	var commandID = 0;
	var pendingCommands = {};
	
	function sendCommand(method, params) {
		pendingCommands[commandID] = {
			method:	method,
			params:	params
		};
		
		socket.emit('command', {
			jsonrpc:	'2.0',
			id:			String(commandID++),
			method:		method,
			params:		params
	    });
	}	
	
	// handling the command result
	socket.on('commandResult', function (params) {
		// console.log('commandResult', params);
		
		var pendingCommand = pendingCommands[params.id];
		
		if(pendingCommand !== null && pendingCommand !== undefined) {
			switch(pendingCommand.method) {
				case CMD_LOGIN:
					service.isLogged = params.result;
					$rootScope.$broadcast('event.login', service.isLogged);
				break;
				
				case CMD_GET_LIST:
					service.contractors = params.result;
					$rootScope.$broadcast('event.update', service.contractors);
				break;	
			}
			delete pendingCommands[params.id];
		}
	});
		
	return service;
}])

// Service responsible for window resizing
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

// Main controller
.controller('BodyController', ['$scope', 'DataService', 'ResizeService', function($scope, DataService, ResizeService){
	var self = this;
	
	$scope.menuStyle = {};		// style for menu
	$scope.contaierStyle = {};	// style for container
	$scope.isShort = false;		// menu elements are shown as icos on small screens
	 
	$scope.contractors = [];	// contractors data
	
	this.updateScope = function() {
		// update scope only if not currenlty updating
		if(!$scope.$$phase) {
			$scope.$apply();
		}	
	};
	
	this.onResize = function(e, args){
		var w = ResizeService.w;
		var h = ResizeService.h;

		if(w < h || (w > h && h > 480)) {
			// menu at top
			$scope.menuStyle = {
				width: 	w + 'px',
				height: '30px',
				float: 'none'
			};
			$scope.mainStyle = {
				width: 	w + 'px',
				height: (h-30) + 'px',
				float: 'none'
			};
			$scope.isShort = w < 400;
		} else {
			// menu at side 
			$scope.menuStyle = {
				width: 	'30px',
				height: h + 'px',
				float: 'left'
			};
			$scope.mainStyle = {
				width: 	(w-30) + 'px',
				height: h + 'px',
				float: 'left'
			};
			$scope.isShort = true;
		}
		
		self.updateScope();
	};
	
	$scope.$on('event.connected', function(){
		DataService.login('root', '12345');
	});
	
	$scope.$on('event.login', function(e, args){
		if(args === true) {
			DataService.getList();
		}
	});	
	
	$scope.$on('event.update', function(e, args){
		$scope.contractors = args;
		self.updateScope();
	});
	
	$scope.$on('event.resize', this.onResize); 
	this.onResize();
}]);

})();
