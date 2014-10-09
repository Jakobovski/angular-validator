 describe('angularValidator', function() {

   beforeEach(angular.mock.module('angularValidator'));

   var scope, compile;

   beforeEach(inject(function($rootScope, $compile) {
     scope = $rootScope.$new();

     htmlForm = angular.element(
       '<form name="myForm" angular-validator>' +
       '<input ng-model="model.firstName" validate-on="dirty" name="firstName" type="text" required/>' +
       '<input ng-model="model.lastName" validate-on="dirty"name="lastName" ng-pattern="/lastName/" invalid-message="\'WHOA\'" type="text" required/>' +
       '<input ng-model="model.city" name="city" type="text" validate-on="dirty" validator="model.city === \'chicago\'" required/>' +
       '<input ng-model="model.state" name="state" type="text" required/>' +
       '</form>'
     );

     element = $compile(htmlForm)(scope);
     scope.$digest();
   }));



   describe('$dirty tests', function() {

     it('should be dirty', function() {
       scope.myForm.lastName.$setViewValue('lastName');
       scope.$digest();

       expect(scope.myForm.lastName.$dirty).toBe(true);
       expect(element.hasClass('ng-dirty')).toBe(true);

     });

     it('should not be $dirty', function() {
       expect(scope.myForm.$pristine).toBe(true);
       expect(element.hasClass('ng-pristine')).toBe(true);
     });
   });


   describe('$valid tests', function() {

     it('should be $valid', function() {
       scope.myForm.lastName.$setViewValue('lastName');
       scope.$digest();

       expect(scope.myForm.lastName.$invalid).toBe(false);
     });

     it('should not be $valid', function() {
       scope.myForm.lastName.$setViewValue('sss');
       scope.$digest();

       expect(scope.myForm.lastName.$invalid).toBe(true);
     });
   });



   describe('custom validator tests', function() {

     it('should be $valid', function() {
       scope.myForm.city.$setViewValue('chicago');
       scope.$digest();

       expect(scope.myForm.city.$invalid).toBe(false);
     });

     it('should not be $valid', function() {
       scope.myForm.city.$setViewValue('sss');
       scope.$digest();

       expect(scope.myForm.city.$invalid).toBe(true);
     });
   });


   describe('.has-error class tests', function() {

     it('should not not have class .has-error', function() {
       expect(element.hasClass('has-error')).toBe(false);
       expect(scope.myForm.$valid).toBe(false);
     });

     it('should not not have class .has-error', function() {
       scope.myForm.firstName.$setViewValue('blah');
       scope.myForm.lastName.$setViewValue('lastName');
       scope.myForm.city.$setViewValue('chicago');
       scope.myForm.state.$setViewValue('chicago');

       scope.$digest();

       expect(element.hasClass('has-error')).toBe(false);
       expect(scope.myForm.$valid).toBe(true);
       expect(scope.myForm.firstName.$valid).toBe(true);
     });


     it('should have the class .has-error', function() {
       scope.myForm.lastName.$setViewValue('blah');
       scope.$digest();

       expect(scope.myForm.lastName.$valid).toBe(false);
       expect(element.hasClass('has-error')).toBe(true);
       expect(scope.myForm.$valid).toBe(false);
       expect(element.hasClass('ng-invalid')).toBe(true);
     });
   });


   describe('required and error messages test', function() {

     it('should not display error or required message', function() {
       expect(element.hasClass('has-error')).toBe(false);
       expect(scope.myForm.$valid).toBe(false);
     });

     it('should show required message', function() {
       scope.myForm.firstName.$setViewValue('');
       scope.$digest();

       expect(element[0][0].nextSibling.innerHTML.indexOf("Required") > 0).toBe(true);
     });


     it('should have the custom invalid message', function() {
       scope.myForm.lastName.$setViewValue('blah');
       scope.$digest();

       expect(element[0][1].nextSibling.innerHTML === "WHOA").toBe(true);
     });
   });

 });