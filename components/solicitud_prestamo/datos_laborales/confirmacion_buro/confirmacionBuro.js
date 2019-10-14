'use strict'
angular.module('solicitudPrestamo')
.controller('confirmacionBuroController',['$scope', 'LoginService', '$state','$log', '$rootScope', 'CLIENT_STATUS', 'ngDialog', '_', 'Cliente', 'MENSAJE', function($scope, LoginService, $state, $log, $rootScope, CLIENT_STATUS, ngDialog, _, Cliente, MENSAJE){
    
    var cliente = new Cliente({id: LoginService.currentUser().id});

    $scope.$watch('init', function(){
        $rootScope.showLoading();

        cliente.updateStatus(CLIENT_STATUS.AUTORIZAR_BURO.value).then(function(){
          $rootScope.hideLoading();
          openDialogConfirm();
        }, function(){
          $rootScope.hideLoading();
        });  
    });

    function openDialogConfirm(){
      var dialogoConfirmacionBuro = ngDialog.open({
        template: 'components/solicitud_prestamo/datos_laborales/templates/popup_autorizacion_buro.html',
        className: 'ngdialog-theme-default',
        closeByEscape: false,
        closeByDocument: false,
        closeByNavigation: false,
        showClose: false,
        controller: ['$scope', 'LoginService', 'semillaService', 'PasswordForgotService', function($scope, LoginService, semillaService, PasswordForgotService) {
          var intentos = 0;

          $scope.continuarAutorizacion = function(password) {
            $scope.dataloading = true;

            semillaService.getSemilla().then(function(response){
              
              var encPassword = md5(password, response.semilla);
              var idUsuario = LoginService.currentUser().id;
              
              PasswordForgotService.validaPassword(idUsuario, encPassword).then(function(usuarioResponse){                            
                dialogoConfirmacionBuro.close();                 
                $state.go(CLIENT_STATUS.EVALUACION.state); 

                return;
              }, function(response){
                $scope.dataloading = false;
                $scope.invalido = true;
                $scope.mensaje = response;              
                intentos = intentos + 1;
                
                if(intentos === 3) {
                  dialogoConfirmacionBuro.close();

                  $rootScope.showMessage(MENSAJE.INTENTOS_ERROR);
                  
                  LoginService.logout().finally(function () {
          
                    $rootScope.hideLoading();               
          
                    $state.go('root');
                  });                   
                }
                return;
              }); 
            });
          };

          $scope.intentos = 0;
          $scope.noAcepto = function(){
            $scope.intentos++;
            
            if($scope.intentos > 1 ){
              $rootScope.logoutAndLogin();
            }

          };

        }]

      });
  }

}]);

 