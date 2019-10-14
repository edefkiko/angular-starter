(function (angular) {

    'use strict';

    var app = angular.module('angular-progress-arc', []);

    app.provider('progressArcDefaults', function () {

        var defaults = {
            size: 200,
            strokeWidth: 20,
            stroke: 'black',
            background: null
        };

        this.setDefault = function (name, value) {
            defaults[name] = value;
            return this;
        };

        this.$get = function () {
            return function (attr) {
                angular.forEach(defaults, function (value, key) {
                    if (!attr[key]) {
                        attr[key] = value;
                    }
                });
            };
        };
    });

    app.directive('progressArc', ['progressArcDefaults', function (progressArcDefaults) {
        return {
            restrict: 'E',
            scope: {
                size:             '@', // Size of element in pixels.
                strokeWidth:      '@', // Width of progress arc stroke.
                stroke:           '@', // Color/appearance of stroke.
                counterClockwise: '@', // Boolean value indicating
                complete:         '&', // Expression evaluating to float [0.0, 1.0]
                background:       '@'  // Color of the background ring. Defaults to null.
            },
            compile: function (element, attr) {

                progressArcDefaults(attr);

                return function (scope, element, attr) {
                    // Firefox has a bug where it doesn't handle rotations and stroke dashes correctly.
                    // https://bugzilla.mozilla.org/show_bug.cgi?id=949661
                    scope.offset = /firefox/i.test(navigator.userAgent) ? -89.9 : -90;
                    var updateRadius = function () {
                        scope.strokeWidthCapped = Math.min(scope.strokeWidth, scope.size / 2 - 1);
                        scope.radius = Math.max((scope.size - scope.strokeWidthCapped) / 2 - 1, 0);
                        scope.circumference = 2 * Math.PI * scope.radius;
                        scope.arcRad = 2 * Math.PI;

                        scope.ejex = Math.cos(scope.arcRad) * scope.radius + scope.size / 2;
                        scope.ejey = Math.sin(scope.arcRad) * scope.radius + scope.size / 2;
                    };
                    scope.$watchCollection('[size, strokeWidth]', updateRadius);
                    updateRadius();
                };
            },
            template:
                '<svg ng-attr-width="{{size}}" ng-attr-height="{{size}}">' +
                    '<circle fill="none" ' +
                        'ng-if="background" ' +
                        'ng-attr-cx="{{size/2}}" ' +
                        'ng-attr-cy="{{size/2}}" ' +
                        'ng-attr-r="{{radius}}" ' +
                        'ng-attr-stroke="{{background}}" ' +
                        'ng-attr-stroke-width="{{strokeWidthCapped}}"' +
                        '/>' +
                    '<circle fill="none" ' +
                        'ng-attr-cx="{{size/2}}" ' +
                        'ng-attr-cy="{{size/2}}" ' +
                        'ng-attr-r="{{radius}}" ' +
                        'ng-attr-stroke="{{stroke}}" ' +
                        'ng-attr-stroke-width="{{strokeWidthCapped}}"' +
                        'ng-attr-stroke-dasharray="{{circumference}}"' +
                        'ng-attr-stroke-dashoffset="{{(1 - complete()) * circumference}}"' +
                        'ng-attr-transform="rotate(-235, {{size/2}}, {{size/2}})' +
                            '{{ (counterClockwise && counterClockwise != \'false\') ? \' translate(0, \' + size + \') scale(1, -1)\' : \'\' }}"' +
                        '/>' + 
                        '<g transform="translate(27,200)"><path stroke="#000000" stroke-width="1.1" d="M9.4 4.4l13.6-3.3 6.3 25.7 -3 0.7 -2.6-10.5 -8.5 2.1 0.2 3.1L4.7 24.7 1 9.6l8.5-2.1L9.4 4.4z"/><polygon fill="#FFFFFF" points="14.6 6.2 13.9 3.2 18.1 2.2 18.8 5.3 "/><polygon points="10.5 7.3 9.7 4.3 13.9 3.2 14.6 6.3 "/><polygon points="18.1 2.2 19.8 1.8 20.5 4.7 18.6 5.3 "/><polygon fill="#FFFFFF" points="6.6 8.1 6.6 8.3 9.5 7.6 9.4 4.4 9.7 4.3 10.5 7.3 "/><polygon points="2.4 9.2 2.5 9.3 6.6 8.3 6.6 8.1 "/><rect x="0.9" y="9.4" transform="matrix(0.9712 -0.2384 0.2384 0.9712 -2.1984 0.675)" fill="#FFFFFF" width="1.6" height="0.2"/><polygon fill="#FFFFFF" points="18.6 5.2 20.5 4.7 21.6 8.9 19.6 9.4 "/><rect x="15.1" y="5.6" transform="matrix(-0.9712 0.2383 -0.2383 -0.9712 35.7623 11.1689)" width="4.3" height="4.3"/><rect x="10.9" y="6.6" transform="matrix(0.2385 0.9712 -0.9712 0.2385 18.4483 -5.9891)" fill="#FFFFFF" width="4.3" height="4.3"/><rect x="6.9" y="7.7" transform="matrix(0.2387 0.9711 -0.9711 0.2387 16.3319 -1.3116)" width="4.3" height="4"/><rect x="2.8" y="8.6" transform="matrix(0.9712 -0.2385 0.2385 0.9712 -2.4209 1.4934)" fill="#FFFFFF" width="4.3" height="4.3"/><polygon points="3.3 13.4 1.9 13.7 0.9 9.5 2.3 9.2 "/><rect x="16" y="9.9" transform="matrix(-0.2384 -0.9712 0.9712 -0.2384 10.9249 32.6322)" fill="#FFFFFF" width="4.5" height="4.3"/><rect x="11.8" y="10.9" transform="matrix(-0.2384 -0.9712 0.9712 -0.2384 4.7772 29.8553)" width="4.5" height="4.3"/><polygon points="19.6 9.4 21.6 8.9 22.6 13.3 20.6 13.8 "/><rect x="8" y="11.8" transform="matrix(-0.9712 0.2383 -0.2383 -0.9712 23.1672 25.2918)" fill="#FFFFFF" width="4" height="4.5"/><rect x="3.9" y="12.8" transform="matrix(0.9712 -0.2385 0.2385 0.9712 -3.4126 1.8679)" width="4.3" height="4.5"/><polygon fill="#FFFFFF" points="4.4 17.8 3 18.1 1.9 13.7 3.3 13.4 "/><polygon fill="#FFFFFF" points="22.6 13.3 23.5 16.8 21.7 17.2 20.7 13.8 "/><polygon points="20.9 13.7 21.7 17.2 17.6 18.2 16.7 14.7 "/><polygon fill="#FFFFFF" points="12.6 15.8 16.7 14.7 17.6 18.2 15.1 18.8 15.2 19.8 13.6 20.2 "/><rect x="8.9" y="16.4" transform="matrix(-0.2384 -0.9712 0.9712 -0.2384 -4.1317 33.6694)" width="4.5" height="4"/><rect x="5" y="17.2" transform="matrix(0.9712 -0.2382 0.2382 0.9712 -4.4289 2.2505)" fill="#FFFFFF" width="4.3" height="4.5"/><polygon points="5.5 22.2 4.1 22.5 3 18.1 4.4 17.8 "/><polygon points="15.2 19.9 15.3 22.1 14.2 22.4 13.7 20.3 "/><polygon fill="#FFFFFF" points="13.7 20.2 14.2 22.4 10.3 23.3 9.7 21.2 "/><polygon points="9.7 21.2 10.3 23.3 6.1 24.3 5.6 22.2 "/><polygon fill="#FFFFFF" points="6.1 24.3 4.6 24.7 4.1 22.5 5.5 22.2 "/></g>' + 
                        '<circle ' + 
                            'ng-attr-fill="{{stroke}}" ' + 
                            'ng-attr-cx="60" ' + 
                            'ng-attr-cy="233" r="12" />' + 
                '</svg>'
        };
    }]);

})(window.angular);
