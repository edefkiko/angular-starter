'use strict'
angular.module('home')
  .factory('prestamosService', ['$http', '$q', 'EnvironmentConfig', 'mambuUtil', '$log', function($http, $q, EnvironmentConfig, mambuUtil, $log) {
    var apiUrl = EnvironmentConfig.backend + '/rest/mambuServicio/';
    var apiBackendUrl = EnvironmentConfig.backend + '/rest/bancomerServicio/transferenciaBancomer';
    var SUCCESS_CODE = 200;
    var OK_CODE = 201;

    function validResponse(deferred, response, status) {
      if ((_(SUCCESS_CODE).isEqual(status) || _(OK_CODE).isEqual(status)) && _(response.errorSource).isEmpty()) {
        deferred.resolve(response);
      } else {

        deferred.reject(response);

      }
    }

    return {
      getLoansByClientId: function(clientId, fullDetails) {
        if (_(fullDetails).isUndefined()) {
          fullDetails = false;
        }

        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: apiUrl,
            params: {
              path: 'clients/' + clientId + "/loans" + '?fullDetails=' + true
            },
            data: ''
          })
          .success(function(response, status) {
            //console.info('===getLoansByClientId->success:'+JSON.stringify(response)); 
            if (_(SUCCESS_CODE).isEqual(status) || _(OK_CODE).isEqual(status) && _(response.errorSource).isEmpty()) {
              var ordered = _.sortBy(response, 'id');
              deferred.resolve(ordered);
            } else {

              deferred.reject(response);

            }
          })
          .error(function(err) {
            console.info('===error:' + JSON.stringify(err));
            deferred.reject(err);
          });

        return deferred.promise;

      },
      getActiveLoanByClientId: function(encodedKey) {
        var deferred = $q.defer();

        var filterConstraints = {
          filterConstraints: [{
            filterSelection: "ACCOUNT_HOLDER_KEY",
            filterElement: "EQUALS",
            value: encodedKey
          }]
        };

        $http({
            method: 'POST',
            url: apiUrl,
            params: {
              path: 'loans/search'
            },
            data: filterConstraints
          })
          .success(function(response, status) {
            //console.info('===getLoansByClientId->success:'+JSON.stringify(response)); 
            if (_(SUCCESS_CODE).isEqual(status) || _(OK_CODE).isEqual(status) && _(response.errorSource).isEmpty()) {

              var loans = [];

              _(response).map(function(loan) {

                if (_('ACTIVE').isEqual(loan.accountState)) {
                  loans.push(loan);
                } else if (_('ACTIVE_IN_ARREARS').isEqual(loan.accountState)) {
                  loans.push(loan);
                }

              });

              if (_(loans).size() > 0) {
                deferred.resolve(loans[0]);
              } else {
                deferred.resolve(response);
              }

            } else {
              deferred.reject(response);
            }


          })
          .error(function(err) {
            console.info('===error:' + JSON.stringify(err));
            deferred.reject(err);
          });

        return deferred.promise;
      },
      /*Metodo que realiza la consulta de clientes y regresa un arreglo de id*/
      getLoansIdByClientId: function(clientId) {
        var self = this;
        var deferred = $q.defer();

        self.getLoansByClientId(clientId).then(function(creditos) {

          var ordered = _.sortBy(creditos, 'id');

          deferred.resolve(mambuUtil.mapearCreditos(ordered));

        }, function(err) {
          console.info('===error:' + JSON.stringify(err));
          deferred.reject(err);
        });

        return deferred.promise;
      },
      obtenerPagos: function(prestamoID) {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: apiUrl,
            params: {
              path: 'loans/' + prestamoID + "/repayments?offset=0&limit=60"
            },
            data: ''
          })
          .success(function(pagos, status) {
            //console.info('===prestamoID:'+prestamoID); 

            validResponse(deferred, pagos, status);

          })
          .error(function(err) {
            console.info('===error:' + JSON.stringify(err));
            deferred.reject(err);
          });;

        return deferred.promise;
      },
      obtenerPrestamo: function(prestamoID) {
        var self = this;
        var deferred = $q.defer();

        self.obtenerPagos(prestamoID).then(function(pagos) {

          $http({
              method: 'GET',
              url: apiUrl,
              params: {
                path: 'loans/' + prestamoID
              },
              data: ''
            })
            .success(function(prestamo, status) {
              //console.info('===success:'+JSON.stringify(prestamo)); 
              if (_(SUCCESS_CODE).isEqual(status) || _(OK_CODE).isEqual(status) && _(prestamo.errorSource).isEmpty()) {
                deferred.resolve(mambuUtil.mapearPrestamoResponse(prestamo, pagos));
              } else {

                deferred.reject(prestamo);

              }

            })
            .error(function(err) {
              console.info('===error:' + JSON.stringify(err));
              deferred.reject(err);
            });

        });


        return deferred.promise;
      },

      obtenerPagosTransactions: function(encodedKeyId) {
        var deferred = $q.defer();
        var transactionsFilter = {
          filterConstraints: [{
            filterSelection: "PARENT_ACCOUNT_KEY",
            filterElement: "EQUALS",
            value: encodedKeyId
          }, {
            filterSelection: "WAS_REVERSED",
            filterElement: "EQUALS",
            value: "FALSE"
          }]
        }
        $http({
            method: 'POST',
            url: apiUrl,
            params: {
              path: 'loans/transactions/search'
            },
            data: transactionsFilter
          })
          .success(function(transacciones, status) {
            // console.info('===transacciones:', transacciones); 
            if (_(SUCCESS_CODE).isEqual(status) || _(OK_CODE).isEqual(status) && _(transacciones.errorSource).isEmpty()) {
              var ordered = _.sortBy(transacciones, 'creationDate').reverse();
              deferred.resolve(ordered);
            } else {

              deferred.reject(transacciones);
            }

            validResponse(deferred, transacciones, status);

          })
          .error(function(err) {
            // console.info('===error:' + JSON.stringify(err));
            deferred.reject(err);
          });;

        return deferred.promise;
      },
      obtenerPrestamoTransactions: function(loan) {
        var self = this;
        var deferred = $q.defer();

        self.obtenerPagosTransactions(loan.encodedKeyId).then(function(transacciones) {

          $http({
              method: 'GET',
              url: apiUrl,
              params: {
                path: 'loans/' + loan.loanId
              },
              data: ''
            })
            .success(function(prestamo, status) {
              //console.info('===success:', prestamo); 
              if (_(SUCCESS_CODE).isEqual(status) || _(OK_CODE).isEqual(status) && _(prestamo.errorSource).isEmpty()) {
                deferred.resolve(mambuUtil.mapearPrestamoResponseTransactions(prestamo, transacciones));
                // var ordered = _.sortBy(transacciones, 'creationDate');
                // deferred.resolve(ordered);  


              } else {

                deferred.reject(prestamo);

              }

            })
            .error(function(err) {
              console.info('===error:' + JSON.stringify(err));
              deferred.reject(err);
            });

        });


        return deferred.promise;
      },

      obtenerCustomInformation: function(loanId, customFieldName) {
        $log.log('loanId', loanId);
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: apiUrl,
            params: {
              path: 'loans/' + loanId + '/custominformation/' + customFieldName
            },
            data: ''
          })
          .success(function(customField, status) {
            //console.info('===success:'+JSON.stringify(customField)); 

            validResponse(deferred, customField, status);

          })
          .error(function(err) {
            console.info('===error:' + JSON.stringify(err));
            deferred.reject(err);
          });

        return deferred.promise;
      },
      getCreditData: function(loanId) {
        // $log.log("el correo es: ", correo); 
        var result = {
          clabe: '',
          numReferencia: '',
          banco: ''
        };

        var mainPromise = $q.defer();
        var promises = [];
        promises[0] = $q.defer();
        promises[1] = $q.defer();
        promises[2] = $q.defer();

        promises[0] = this.obtenerCustomInformation(loanId, 'Cta_Corp_Cuentas_de_Prestamo').then(function(response) {
          if (response && response.length > 0) {
            result.clabe = response[0].value;
          }
        });
        promises[1] = this.obtenerCustomInformation(loanId, 'Banco_Corp_Cuentas_de_Prestamo').then(function(response) {
          if (response && response.length > 0) {
            result.banco = response[0].value;
          }
        });
        promises[2] = this.obtenerCustomInformation(loanId, 'Num_Ref_Cuentas_de_Prestamo').then(function(response) {
          if (response && response.length > 0) {
            result.numReferencia = response[0].value;
          }

        });

        $q.all(promises).then(function() {
          mainPromise.resolve(result);
        });

        return mainPromise.promise;
      },
      updateState: function(loanId, state) {
        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: apiUrl,
            params: {
              path: "loans/" + loanId + "/transactions"
            },
            data: {
              type: state
            }
          })
          .success(function(customField, status) {
            //console.info('===getLoansByClientId->success:'+JSON.stringify(response)); 
            validResponse(deferred, customField, status);
          })
          .error(function(err) {
            // console.info('===error:' + JSON.stringify(err));
            deferred.reject(err);
          });

        return deferred.promise;
      },

      disbursment: function(clienteId, solicitudId) {
        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: apiBackendUrl,
            data: {
              clienteId: clienteId,
              solicitudId: solicitudId
            }
          })
          .success(function(response, status) {
            if (_(SUCCESS_CODE).isEqual(status) && _("0").isEqual(response.resultado)) {
              deferred.resolve(response.cat);
            } else {
              deferred.reject(response);
            }
          })
          .error(function(err) {
            console.info('===error:' + JSON.stringify(err));
            deferred.reject(err);
          });

        return deferred.promise;
      }

    };

  }]);