var app = angular.module('angular-validator-demo', ['angularValidator']);

// Workaround for bug #1404
// https://github.com/angular/angular.js/issues/1404
// Source: http://plnkr.co/edit/hSMzWC?p=preview
app.config(['$provide', function ($provide) {
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
}]);

angular.module('angular-validator-demo').controller('DemoCtrl', function ($scope) {

  $scope.items = [
    { id: 1, name: 'test1'},
    { id: 2, name: 'test2'}
  ];

  var i = 2;
  $scope.add = function () {
    i++;
    $scope.items.push({ id: i, name: 'test' + i});
  };

  $scope.submitMyForm = function () {
    alert("Form submitted");
  };

  $scope.myCustomValidator = function (text) {
    return true;
  };


  $scope.anotherCustomValidator = function (text) {
    if (text === "rainbow") {
      return true;
    }
    else return "type in 'rainbow'";
  };

  $scope.passwordValidator = function (password) {

    if (!password) {
      return;
    }

    if (password.length < 6) {
      return "Password must be at least " + 6 + " characters long";
    }

    if (!password.match(/[A-Z]/)) {
      return "Password must have at least one capital letter";
    }

    if (!password.match(/[0-9]/)) {
      return "Password must have at least one number";
    }

    return true;
  };

});