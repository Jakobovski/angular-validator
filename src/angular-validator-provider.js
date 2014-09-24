// Workaround for bug #1404
// https://github.com/angular/angular.js/issues/1404
// Source: http://plnkr.co/edit/hSMzWC?p=preview
angular.module('angularValidator')
  .provider('angularValidator', ['$provide', function ($provide) {

    this.decorateNgModelDirective = function () {
      $provide.decorator('ngModelDirective', ['$delegate', function ($delegate) {
        var ngModel = $delegate[0], controller = ngModel.controller;
        ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function (scope, element, attrs, $injector) {
          var $interpolate = $injector.get('$interpolate');
          attrs.$set('name', $interpolate(attrs.name || '')(scope));
          $injector.invoke(controller, this, {
            '$scope': scope,
            '$element': element,
            '$attrs': attrs
          });
        }];

        return $delegate;
      }]);
    };

    this.decorateFormDirective = function () {
      $provide.decorator('formDirective', ['$delegate', function ($delegate) {
        var form = $delegate[0], controller = form.controller;
        form.controller = ['$scope', '$element', '$attrs', '$injector', function (scope, element, attrs, $injector) {
          var $interpolate = $injector.get('$interpolate');
          attrs.$set('name', $interpolate(attrs.name || attrs.ngForm || '')(scope));
          $injector.invoke(controller, this, {
            '$scope': scope,
            '$element': element,
            '$attrs': attrs
          });
        }];

        return $delegate;
      }]);
    };

    this.$get = function () {
      return {};
    }

  }]);
