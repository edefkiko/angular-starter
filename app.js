var app = angular.module('app', ['ui.router','vcRecaptcha', 'ngDialog', 'directives.formulario', 'underscore', 'authServices', 'login', 'chat', 'home', 'client', 'datosPersonales', 'solicitudPrestamo', 'ab-base64', 'homeRecontratacion', 'homeHistoricoPrestamo', 'rzModule','mm.foundation', 'webcam', 'angular-progress-arc', 'LocalStorageModule', 'ngToast', 'blockUI', 'simulador', 'profile', 'angucomplete-alt', 'buscador', 'notificaciones', 'ngPostMessage', 'ngAnimate', 'ngIdle', 'constant'])
	.config(function($stateProvider, $urlRouterProvider, $httpProvider, $anchorScrollProvider, localStorageServiceProvider, ngToastProvider, blockUIConfig, EnvironmentConfig, $provide, IdleProvider, KeepaliveProvider, TitleProvider, VIEW_PATH) {

		// Redirect to 404 when route not found
		/*$urlRouterProvider.otherwise(function($injector, $location){
			$injector.get('$state').transitionTo('login', null, {
				location: false
			});
		});*/
		if(_(true).isEqual(EnvironmentConfig.isMobile)){
			$urlRouterProvider.when('', '/loginApp');
		}else{
			$urlRouterProvider.when('', '/');
		}


		$stateProvider
		.state('root', {
			url: '/',
			templateUrl: 'components/core/views/root.html',
			controller: 'principalHomeController',
			data: {
				ignoreState: true
			},
			ignoreState: true
		})
		.state('not-found', {
			url: '/not-found',
			templateUrl: 'components/core/views/404view.html',
			data: {
				ignoreState: true
			},
			ignoreState: true
		})
        .state('acercade', {
			url: '/acercade',
			ignoreState: true,
			templateUrl: 'components/core/views/acercade.html',
			data: {
				ignoreState: true
			}
		})
        .state('preguntasFrecuentes', {
			url: '/preguntasFrecuentes',
			ignoreState: true,
			templateUrl: 'components/core/views/preguntasFrecuentes.html',
			data: {
				ignoreState: true
			}
		})
        .state('costosComisiones', {
			url: '/costosComisiones',
			ignoreState: true,
			templateUrl: 'components/core/views/costosComisiones.html',
			data: {
				ignoreState: true
			}
		})
        .state('terminosCondiciones', {
            url: '/terminosCondiciones',
            ignoreState: true,
            templateUrl: 'components/core/views/terminosCondiciones.html',
            data: {
                ignoreState: true
            }
		})
        .state('politicaPrivacidad', {
			url: '/aviso-de-privacidad',
			ignoreState: true,
			templateUrl: 'components/core/views/politicaPrivacidad.html',
			data: {
				ignoreState: true
			}
		})
        .state('derechosArco', {
			url: '/derechosArco',
			ignoreState: true,
			templateUrl: 'components/core/views/derechosArco.html',
			data: {
				ignoreState: true
			}
		})
		.state('unidadAtencionEspecializada', {
			url: '/unidadAtencionEspecializada',
			ignoreState: true,
			templateUrl: 'components/core/views/unidadAtencionEspecializada.html',
			data: {
				ignoreState: true
			}
		})
		.state('buroCredito', {
			url: '/buroCredito',
			ignoreState: true,
			templateUrl: 'components/core/views/buroCredito.html',
			data: {
				ignoreState: true
			}
		})
		.state('maintenance', {
			url: '/maintenance/:problema',
			controller: 'maintenanceController',
			templateUrl: 'components/core/views/maintenance.html',
			data: {
				ignoreState: true
			},
			ignoreState: true
		});

		$httpProvider.interceptors.push('AuthInterceptor');
		$anchorScrollProvider.disableAutoScrolling();

		localStorageServiceProvider
	    .setPrefix('digifin')
	    .setStorageType('sessionStorage')
	    .setNotify(true, true);

	    ngToastProvider.configure({
			animation: 'slide', // or 'fade'
			additionalClasses: 'background-azul'
		});

		blockUIConfig.message = 'Cargando';
		blockUIConfig.autoBlock = false;

        $httpProvider.defaults.timeout = 10000;

        $provide.decorator('$log', ['$delegate',
			function($delegate) {
				var $log, enabled = true;

				$log = {
					debugEnabled: function(flag) {
						enabled = !!flag;
					}
				};

				// methods implemented by Angular's $log service
				['log', 'debug', 'warn', 'info', 'error'].forEach(function(methodName) {
					$log[methodName] = function() {
						if (!enabled) return;

						var logger = $delegate;
						logger[methodName].apply(logger, arguments);
					}
				});

				return $log;
			}
		]);

		// configure Idle settings
		IdleProvider.idle(EnvironmentConfig.idle.idle); // in seconds
		IdleProvider.timeout(EnvironmentConfig.idle.timeout); // in seconds
		KeepaliveProvider.interval(EnvironmentConfig.idle.interval); // in seconds
		TitleProvider.enabled(false);

	})
	.run(function($rootScope, $state, LoginService, AUTH_EVENTS, $anchorScroll, $timeout, $stateParams, $location, $log, EnvironmentConfig, Idle, $window){
		LoginService.init();

		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
			if(toState.authenticate && !LoginService.isLoggedIn()){
				$state.transitionTo("login");
				event.preventDefault();
				Idle.unwatch();
			}else if(LoginService.isLoggedIn()){
				Idle.watch();
			}

			if (toState.resolve) {
		         $rootScope.showLoading();
		    }

		});

		// Record previous state
	  	$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
	  		if (toState.resolve) {
		    	$rootScope.hideLoading();
		    }

	  		if(toState.authenticate){
	  			$rootScope.$emit('loadUserData');
	  		}

	    	if($stateParams.id) {
	  			$location.hash($stateParams.id);
	  		}
	  		if(!toState.ignoreState) {
	  			$window.ga('send', 'pageview', toState.gaViewName.name);
	  		}

		    $timeout(function(){$anchorScroll()}, 1);
	  	});

		$rootScope.$on('$viewContentLoaded', function () {
	        $(document).foundation();
            $('.collapsible').collapsible();
	    });

	    $log.debugEnabled(EnvironmentConfig.debugEnabled);

	    $rootScope.$on('IdleTimeout', function() {
	        $log.debug('========================================IDLE');

	        if(LoginService.isLoggedIn()){
				 var message = "¡Debido al periodo de inactividad se ha cerrado tu sesión!";
				$rootScope.logoutAndLogin(message);
			}
	    });

	});