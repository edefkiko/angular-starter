'use strict'
angular.module('solicitudPrestamo')
  .controller('autorizarFirmaController', ['$scope', 'LoginService', '$state', '$log', '$rootScope', 'CLIENT_STATUS', 'ngDialog', '_', 'Cliente', 'MENSAJE', 'contratoServicio', 'localStorageService', 'Prestamo', 'pagareServicio', function($scope, LoginService, $state, $log, $rootScope, CLIENT_STATUS, ngDialog, _, Cliente, MENSAJE, contratoServicio, localStorageService, Prestamo, pagareServicio) {
    var userId = LoginService.currentUser().id;
    var cliente = new Cliente({
      id: userId
    });
    var memorySolicitud = localStorageService.get('solicitud');
    var prestamoModel = new Prestamo({
      id: memorySolicitud.idPrestamo
    });

    $scope.$watch('init', function() {
      $rootScope.showLoading();

      cliente.updateStatus(CLIENT_STATUS.AUTORIZAR_FIRMA.value).then(function() {

        $rootScope.hideLoading();
        openDialogConfirm();

      }, function() {
        $rootScope.hideLoading();
      });
    });

    function openDialogConfirm() {
      var dialogoAutorizarFirma = ngDialog.open({
        template: 'components/solicitud_prestamo/pendiente_firma/templates/popup_autorizar_firma.html',
        className: 'ngdialog-theme-default',
        closeByEscape: false,
        closeByDocument: false,
        closeByNavigation: false,
        showClose: false,
        controller: ['$scope', 'LoginService', 'semillaService', 'PasswordForgotService', 'localStorageService', 'Prestamo', 'Cliente', 'Solicitud', function($scope, LoginService, semillaService, PasswordForgotService, localStorageService, Prestamo, Cliente, Solicitud) {
          var intentos = 0;
          var cliente = new Cliente({
            id: userId
          });

          $scope.continuarAutorizacion = function(password) {
            $scope.dataloading = true;

            semillaService.getSemilla().then(function(response) {

              var encPassword = md5(password, response.semilla);

              PasswordForgotService.validaPassword(userId, encPassword).then(function(usuarioResponse) {

                dialogoAutorizarFirma.close();

                $rootScope.showLoading();
                pagareServicio.altaPagare(userId, memorySolicitud.idPrestamo).then(function() {
                  $log.info('altaPagare');
                });

                contratoServicio.altaContratoCredito(userId, memorySolicitud.idPrestamo).then(function() {

                  prestamoModel.esTransferenciaLaDispersion().then(function(response) {
                    /*
                    //TODO SE COMENTA EL CODIGO HASTA LA IMPLEMENTACION CON BBVA
                    if(_(true).isEqual(response)){
                      prestamoModel.disbursmentFromServer(userId, memorySolicitud.id).then(function() {

                        $rootScope.hideLoading();
                        updateLocalData();
                        $state.go('home');

                      });
                    }else{

                      cliente.updateSituacionToCliente().then(function() {

                        cliente.firmar(memorySolicitud).then(function() {

                          prestamoModel.disbursment().then(function() {

                            $rootScope.hideLoading();
                            updateLocalData();
                            $state.go('home');

                          });

                        }, function() {
                          $log.error('disbursment error');
                          $rootScope.hideLoading();
                        });

                      });

                    }
                    */

                   cliente.updateSituacionToCliente().then(function() {

                    cliente.firmar(memorySolicitud).then(function() {

                      prestamoModel.disbursment().then(function() {

                        $rootScope.hideLoading();
                        updateLocalData();
                        $state.go('home');

                      });

                    }, function() {
                      $log.error('disbursment error');
                      $rootScope.hideLoading();
                    });

                  });
                  });

                });

              }, function(response) {
                $scope.dataloading = false;
                $scope.invalido = true;
                $scope.mensaje = response;
                intentos = intentos + 1;

                if (intentos === 3) {
                  dialogoAutorizarFirma.close();

                  $rootScope.showMessage(MENSAJE.INTENTOS_ERROR);

                  LoginService.logout().finally(function() {


                    $rootScope.hideLoading();

                    $state.go('root');
                  });
                }
                return;
              });
            });
          }
        }]

      });
    }

    function updateLocalData(){
        var user = localStorageService.get('user');

        if(!_(user).isEmpty()){
          user.situacion = 'Cliente';
          user.idSolicitud = null;

          localStorageService.set('user', user);
        }
    }

  }]);