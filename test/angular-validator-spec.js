 describe('angularValidator', function() {

   beforeEach(angular.mock.module('angularValidator'));

   var scope, compile;

   describe('angularValidator with dotted name', function () {
     var htmlForm, element, linkIt;

     beforeEach(inject(function ($rootScope, $compile) {
       scope = $rootScope.$new();
       scope.object = {};

       htmlForm = angular.element(
           '<form name="object.form" angular-validator>' +
           '<input ng-model="model.firstName" validate-on="dirty" name="firstName" type="text" required/>' +
           '</form>'
       );

       linkIt = function () {
         element = $compile(htmlForm)(scope);
         scope.$digest();
       };
     }));

     it('should not throw an error during linking', function () {
       expect(linkIt).not.toThrow();
     });

     it('should correctly parse the dotted form name, evidenced by what\'s on scope', function () {
       linkIt();
       expect(scope.object.form).toBeDefined();
     });
   });
   
  describe('angularValidator without form invalid message', function () {
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


 describe('angularValidator with form invalid message', function () {

   var mockCustomMessage;

   beforeEach(function () {
     mockCustomMessage = {
       // scopeElementModel is the object in scope version, element is the object in DOM version
       message: function (scopeElementModel, element) {
         var errors = scopeElementModel.$error;
         if (errors.maxlength) {
           return "'Should be no longer than " + element.attributes['ng-maxlength'].value + " characters!'";
         } else {
           // default message
           return "'This field is invalid!'";
         }
       }
     };

     module(function ($provide) {
       $provide.value('customMessage', mockCustomMessage);
     });
   });

   beforeEach(inject(function ($rootScope, $compile) {
     scope = $rootScope.$new();

     htmlForm = angular.element(
       '<form name="myForm" angular-validator invalid-message="customMessage">' +
       '<input ng-model="model.firstName" validate-on="dirty" name="firstName" type="text" required ng-maxlength="5"/>' +
       '<input ng-model="model.lastName" validate-on="dirty" name="lastName" type="text" required ng-maxlength="5" invalid-message="\'The last name is too long!\'"/>' +
       '</form>'
     );

     element = $compile(htmlForm)(scope);
     scope.$digest();
   }));


   describe('form invalid message function', function () {

     it('should show message from customMessage service', function () {
       scope.myForm.firstName.$setViewValue('Joseph');
       scope.$digest();

       expect(element.hasClass('has-error')).toBe(true);
       expect(scope.myForm.firstName.$invalid).toBe(true);
       expect(element[0][0].nextSibling.innerHTML === 'Should be no longer than 5 characters!').toBe(true);
     });

     it('should not show message from customMessage service', function () {
       scope.myForm.firstName.$setViewValue('John');
       scope.$digest();

       expect(element.hasClass('has-error')).toBe(false);
       expect(scope.myForm.firstName.$valid).toBe(true);
     });

     it('field invalid message should have higher priority than form invalid message', function () {
       scope.myForm.lastName.$setViewValue('Joseph');
       scope.$digest();

       expect(element[0][1].nextSibling.innerHTML === 'The last name is too long!').toBe(true);
     });

   });
 });


 describe('form with attribute "angular-validator-quiet"', function(){
   beforeEach(inject(function ($rootScope, $compile) {
     scope = $rootScope.$new();

     htmlForm = angular.element(
       '<form name="myForm" angular-validator angular-validator-quiet>' +
       '<input ng-model="model.firstName" validate-on="dirty" name="firstName" type="text" required ng-maxlength="5"/>' +
       '</form>'
     );

     element = $compile(htmlForm)(scope);
     scope.$digest();
   }));

   it('should not add generated required label', function(){
       htmlForm.triggerHandler('submit');

       expect(element[0][0].nextSibling).toBeFalsy();
   });
 });

 describe('form with attribute "angular-validator-quiet"', function(){
   beforeEach(inject(function ($rootScope, $compile) {
     scope = $rootScope.$new();

     htmlForm = angular.element(
       '<form name="myForm" angular-validator>' +
       '<input ng-model="model.firstName" validate-on="dirty" name="firstName" type="text" required ng-maxlength="5"/>' +
       '<input ng-model="model.lastName" validate-on="dirty" name="firstName" type="text" required ng-maxlength="5" angular-validator-quiet/>' +
       '</form>'
     );

     element = $compile(htmlForm)(scope);
     scope.$digest();
   }));

   it('should not add generated required label', function(){
     htmlForm.triggerHandler('submit');

     expect(element[0][1].nextSibling).toBeFalsy();
   });
 });
});