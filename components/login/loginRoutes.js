angular.module('login')
	.config(function($stateProvider, VIEW_PATH) {
		$stateProvider
			.state("login", {
				url: "/login",
				ignoreState : true,
				templateUrl: "components/login/login.html",
				resolve: {
					semilla: ['semillaService', '$q', function(semillaService, $q) {
			        	var deferred = $q.defer();

			        	semillaService.getSemilla().then(function(response){
			        		deferred.resolve(response.semilla);
			        	});

			        	return deferred.promise;
			        }]
				},		        
		        controller: "loginCtrl",
		        params: {
		        	pagOrigen: null
		        }

			})
			.state("redirect", {
				url: "/redirect",
				authenticate: true,
				templateUrl: "components/login/redirect/redirect.html",	 
				params: {
					status: null,
					origenPag: null
				},
		        controller: "redirectCtrl",
		        ignoreState: true

			})
			.state('password', {
		        abstract: true,
		        url: '/password',
		        template: '<ui-view/>',
		        ignoreState: true
		     })
			.state("password.forgot", {
				abstract: true,
		        url: '/forgot',
		        template: '<ui-view/>',
		        ignoreState: true
			})
			.state("password.forgot.main", {
				url: "/main",
				gaViewName: VIEW_PATH.passwordForgot,
				controller: "passwordForgotCtrl",
				templateUrl: "components/login/passwordForgot.html"
			})
			.state("password.forgot.success", {
				url: "/success",
				templateUrl: "components/login/templates/passwordForgotSuccess.html",
				ignoreState: true
			})
			.state("password.reset", {
				url: "/reset",
				gaViewName: VIEW_PATH.resetPassword,
				resolve: {
					semilla: ['semillaService', '$q', function(semillaService, $q) {
			        	var deferred = $q.defer();

			        	semillaService.getSemilla().then(function(response){
			        		deferred.resolve(response.semilla);
			        	});

			        	return deferred.promise;
			        }]
				},
				controller: "passwordResetCtrl",
				templateUrl: "components/login/passwordReset.html"
			})
			.state("password.resetcodigo", {
				abstract: true,
				url: "/resetcodigo",
				template: "<ui-view/>",
				ignoreState: true
			})
			.state("password.resetcodigo.main", {
				url: "/main/:codigo",
				controller: "passwordResetCodigoCtrl",
				templateUrl: "components/login/passwordResetCodigo.html",
				ignoreState: true
			})
			.state("loginApp", {
				controller: "loginCtrl",
				url: "/loginApp",
				templateUrl: "components/login/app/loginApp.html",
				resolve: {
					semilla: ['semillaService', '$q', function(semillaService, $q) {
			        	var deferred = $q.defer();

			        	semillaService.getSemilla().then(function(response){
			        		deferred.resolve(response.semilla);
			        	});

			        	return deferred.promise;
			        }]
				},
		        params: {
		        	pagOrigen: null
		        },
		        ignoreState: true
			});
	});