angular.module('angularValidator', []);

angular.module('angularValidator').provider('ErrorMessages',
  function(){

    // private defaults messages
    var messages = {
      required: 'Required',
      invalid: 'Invalid'
    };
    // public defaults messages setter
    this.setDefaults = function(params){
      angular.extend(messages, params);
      return this
    };

    var template = function(messageText){
      return "<label class='control-label has-error validationMessage'><i class='fa fa-times'></i>" + messageText + "</label>";
    };

    this.setTemplate = function(fn){
      template = fn;
      return this
    };
    // public template setter

    // public api used by directive
    var self = this;
    this.$get = function(){
      return {
        defaultFor: function(name){
          return messages[name]
        },
        generateTemplate: template
      }
    }
  }
);
angular.module('angularValidator').directive('angularValidator', ["ErrorMessages",
  function(ErrorMessages) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs, fn) {

        // This is the DOM form element
        var DOMForm = angular.element(element)[0];

        // This is the the scope form model
        // All validation states are contained here
        var scopeForm = scope[DOMForm.name];

        // Set the default submitted state to false
        scopeForm.submitted = false;

        // Intercept and handle submit events of the form
        element.on('submit', function(event) {
          event.preventDefault();
          scope.$apply(function() {
            scopeForm.submitted = true;
          });

          // If the form is valid then call the function that is declared in the angular-validator-submit atrribute on the form element
          if (scopeForm.$valid) {
            scope.$apply(function() {
              if (DOMForm.attributes["angular-validator"].value.length){
                scope.$eval(DOMForm.attributes["angular-validator"].value);
              }
              else {
                scope.$eval(DOMForm.attributes["angular-validator-submit"].value);
              }
            });
          }
        });

        // Setup watches on all form fields
        setupWatches(DOMForm);


        // Iterate through the form fields and setup watches on each one
        function setupWatches(formElement) {
          for (var i = 0; i < formElement.length; i++) {
            // This ensures we are only watching form fields
            if (i in formElement) {
              // Make sure the element is a form field and not a button for example
              // Only form elements should have names.
              if (formElement[i].name in scopeForm) {
                setupWatch(formElement[i]);
              }
            }
          }
        }


        // Setup $watch on a single formfield
        function setupWatch(elementToWatch) {

          // If element is set to validate on blur then update the element on blur
          if ("validate-on" in elementToWatch.attributes && elementToWatch.attributes["validate-on"].value === "blur") {
            angular.element(elementToWatch).on('blur', function() {
              updateValidationMessage(elementToWatch);
              updateValidationClass(elementToWatch);
            });
          }

          scope.$watch(function() {
              return elementToWatch.value + scopeForm.submitted + checkElementValididty(elementToWatch) + getDirtyValue(scopeForm[elementToWatch.name]);
            },
            function() {
              // if dirty show
              if ("validate-on" in elementToWatch.attributes && elementToWatch.attributes["validate-on"].value === "dirty") {
                updateValidationMessage(elementToWatch);
                updateValidationClass(elementToWatch);
              }
              // Update the field immediately if the form is submitted or the element is valid
              else if (scopeForm.submitted || (scopeForm[elementToWatch.name] && scopeForm[elementToWatch.name].$valid)) {
                updateValidationMessage(elementToWatch);
                updateValidationClass(elementToWatch);
              }
            });
        }


        // Returns the $dirty value of the element if it exists
        function getDirtyValue(element) {
          if (element) {
            if ("$dirty" in element) {
              return element.$dirty;
            }
          }
        }


        function checkElementValididty(element) {
          //   Call the custom validator function
          var isElementValid = true;
          if ("validator" in element.attributes) {
            // Call the custom validator function
            var isElementValid = scope.$eval(element.attributes.validator.value);
            scopeForm[element.name].$setValidity("invalid", isElementValid);
            return isElementValid;
          }
          return isElementValid;
        }


        // Adds and removes an error message as a sibling element of the form field
        // depending on the validity of the form field and the submitted state of the form.
        // Will use default message if a custom message is not given
        function updateValidationMessage(element) {

          var scopeElementModel = scopeForm[element.name];

          // Only add/remove validation messages if the form field is $dirty or the form has been submitted
          if (scopeElementModel.$dirty || scope[element.form.name].submitted) {

            // Remove all validation messages
            var validationMessageElement = isValidationMessagePresent(element);
            if (validationMessageElement) {
              validationMessageElement.remove();
            }

            if (!angular.equals({}, scopeElementModel.$error)) {
              var errorMessage;
              for (var errorName in scopeElementModel.$error) {
                if ((errorName + '-message') in element.attributes) {
                  errorMessage = scope.$eval(element.attributes[errorName + '-message'].nodeValue)
                }
                else {
                  errorMessage = ErrorMessages.defaultFor(errorName) || errorName
                }
              }
              angular.element(element).after(ErrorMessages.generateTemplate(errorMessage));
            }
          }
        }

        // Returns the validation message element or False
        function isValidationMessagePresent(element) {
          var elementSiblings = angular.element(element).parent().children();
          for (var i = 0; i < elementSiblings.length; i++) {
            if (angular.element(elementSiblings[i]).hasClass("validationMessage")) {
              return angular.element(elementSiblings[i]);
            }
          }
          return false;
        }


        // Adds and removes .has-error class to both the form element and the form element's parent
        // depending on the validity of the element and the submitted state of the form
        function updateValidationClass(element) {
          // Make sure the element is a form field and not a button for example
          // Only form fields should have names.
          if (!(element.name in scopeForm)) {
            return;
          }
          var formField = scopeForm[element.name];

          // Only add/remove validation classes if the field is $dirty or the form has been submitted
          if (formField.$dirty || scope[element.form.name].submitted) {
            if (formField.$valid) {
              angular.element(element.parentNode).removeClass('has-error');

              // This is extra for users wishing to implement the .has-error class on the field itself
              // instead of on the parent element. Note that Bootstrap requires the .has-error class to be on the parent element
              angular.element(element).removeClass('has-error');
            } else if (formField.$invalid) {
              angular.element(element.parentNode).addClass('has-error');

              // This is extra for users wishing to implement the .has-error class on the field itself
              // instead of on the parent element. Note that Bootstrap requires the .has-error class to be on the parent element
              angular.element(element).addClass('has-error');
            }
          }
        }

      }
    };
  }
]);