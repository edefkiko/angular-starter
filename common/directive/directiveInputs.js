'use strict';
angular.module('directives.formulario', ['ngPatternRestrict'])
.directive('ngMin', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMin, function(){
                if (ctrl.$isDirty){
                  ctrl.$setViewValue(ctrl.$viewValue);
                }
            });

            var isEmpty = function (value) {
               return angular.isUndefined(value) || value === '' || value === null;
            };

            var minValidator = function(value) {
              var min = scope.$eval(attr.ngMin) || 0;
              if (!isEmpty(value) && value < min) {
                ctrl.$setValidity('ngMin', false);
                return undefined;
              } else {
                ctrl.$setValidity('ngMin', true);
                return value;
              }
            };

            ctrl.$parsers.push(minValidator);
            ctrl.$formatters.push(minValidator);
        }
    };
})
.directive('ngMax', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMax, function(){
                if (ctrl.$isDirty){
                  ctrl.$setViewValue(ctrl.$viewValue);
                }
            });

            var isEmpty = function (value) {
               return angular.isUndefined(value) || value === '' || value === null;
            };

            var maxValidator = function(value) {
              var max = scope.$eval(attr.ngMax) || Infinity;
              if (!isEmpty(value) && value > max) {
                ctrl.$setValidity('ngMax', false);
                return undefined;
              } else {
                ctrl.$setValidity('ngMax', true);
                return value;
              }
            };

            ctrl.$parsers.push(maxValidator);
            ctrl.$formatters.push(maxValidator);
        }
    };
})
// mascara del moneda en el input
.directive('blurToCurrency', function($filter){
  return {
    scope: {
      amount  : '='
    },
    link: function(scope, el, attrs){
      el.val($filter('currency')(scope.amount));

      el.bind('focus', function(){
        el.val(scope.amount);
      });

      el.bind('input', function(){
        scope.amount = el.val();
        scope.$apply();
      });

      el.bind('blur', function(){
        el.val($filter('currency')(scope.amount));
      });
    }
  };
})

.directive('validNumber', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return;
      }
      ngModelCtrl.$parsers.push(function(val) {
        if (angular.isUndefined(val)) {
            val = '';
        }

        var clean = val.replace(/[^-0-9\.]/g, '');
        var negativeCheck = clean.split('-');
      	var decimalCheck = clean.split('.');
        if(!angular.isUndefined(negativeCheck[1])) {
            negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
            clean =negativeCheck[0] + '-' + negativeCheck[1];
            if(negativeCheck[0].length > 0) {
            	clean =negativeCheck[0];
            }

        }

        if(!angular.isUndefined(decimalCheck[1])) {
            decimalCheck[1] = decimalCheck[1].slice(0,2);
            clean =decimalCheck[0] + '.' + decimalCheck[1];
        }

        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });

      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
})
.directive('stopccp', function(){
    return {
        scope: {},
        link:function(scope,element){
            element.on('cut copy paste', function (event) {
              event.preventDefault();
            });
        }
    };
})
.directive('format', ['$filter', function ($filter){
   return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;


            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });


            ctrl.$parsers.unshift(function (viewValue) {
                              
          elem.priceFormat({
            prefix: '',
            centsSeparator: '.',
            thousandsSeparator: ','
        });                
                         
                return elem[0].value;
            });
        }
    };
    
}]);
