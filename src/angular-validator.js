angular.module('angularValidator', []);

angular.module('angularValidator')
  .directive('angularValidator', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        // This is the DOM form element
        var DOMForm = angular.element(element)[0];

        // This is the the scope form model
        // All validation states are containted here
        var scopeForm = scope[DOMForm.name];

        // Set the default submitted state to false
        scopeForm.submitted = false;

        var watchers = [];

        // Intercept and handle submit events of the form
        element.on('submit', function (event) {
          event.preventDefault();
          scope.$apply(function () {
            scopeForm.submitted = true;
          });

          // If the form is valid then call the function that is declared in the angular-validator-submit atrribute on the form element
          if (scopeForm.$valid) {
            scope.$eval(DOMForm.attributes["angular-validator-submit"].value);
          }
        });

        var formChangeWatcher = scope.$watch(
          function () {
            return angular.element(element)[0].length;
          },
          function () {
            destroyWatchers();
            setupWatches(angular.element(element)[0]);
          }
        );

        element.bind('$destroy', function () {
          formChangeWatcher();
          destroyWatchers();
        });

        // Setup watches on all form fields
        setupWatches(DOMForm);

        // Iterate through the form fields and setup watches on each one
        function setupWatches(formElement) {
          for (var i = 0; i < formElement.length; i++) {
            // This ensures we are only watching form fields
            if (i in formElement) {
              setupWatch(formElement[i]);
            }
          }
        }

        function destroyWatchers() {
          while (watchers.length) {
            var watcher = watchers.pop();
            watcher();
          }
        }

        // Setup $watch on a single formfield
        function setupWatch(elementToWatch) {
          watchers.push(scope.$watch(function () {
              // We are watching both the value of the element, the value of form.submitted, the validity of the element and the $dirty property of the element
              // We need to watch $dirty becuase angular will somtimes run $dirty checking after the watch functions have fired the first time.
              // Adding the four items together is a bit of a trick
              return elementToWatch.value + scopeForm.submitted + checkElementValidity(elementToWatch) + getDirtyValue(scopeForm[elementToWatch.name]) + getModelValue(scopeForm[elementToWatch.name]);
            },
            function () {
              updateValidationMessage(elementToWatch);
              updateValidationClass(elementToWatch);
            })
          );
        }

        // Returns the $dirty value of the element if it exists
        function getDirtyValue(element) {
          if (element) {
            if ("$dirty" in element) {
              return element.$dirty;
            }
          }
        }

        function getModelValue(element) {
          if (element) {
            if ("$modelValue" in element) {
              return element.$modelValue;
            }
          }
        }

        function checkElementValidity(element) {
          // If element has a custom validation function
          if ("validator" in element.attributes) {
            // Call the custom validator function
            var isElementValid = scope.$eval(element.attributes.validator.value);
            scopeForm[element.name].$setValidity("angularValidator", isElementValid);
            return isElementValid;
          }
        }

        // Adds and removes an error message as a sibling element of the form field
        // depending on the validity of the form field and the submitted state of the form.
        // Will use default message if a custom message is not given
        function updateValidationMessage(element) {

          var defaultRequiredMessage = function () {
            return "<i class='fa fa-times'></i> Required";
          };
          var defaultInvalidMessage = function () {
            return "<i class='fa fa-times'></i> Invalid";
          };

          // Make sure the element is a form field and not a button for example
          // Only form elements should have names.
          if (!(element.name in scopeForm)) {
            return;
          }

          var scopeElementModel = scopeForm[element.name];

          // Always remove all validation messages
          var validationMessageElement = isValidationMessagePresent(element);
          if (validationMessageElement) {
            validationMessageElement.remove();
          }

          // Only add validation messages if the form field is $dirty or the form has been submitted
          if (scopeElementModel.$dirty || scope[element.form.name].submitted) {

            if (scopeElementModel.$error.required) {
              // If there is a custom required message display it
              if ("required-message" in element.attributes) {
                appendErrorMessage(element, element.attributes['required-message'].value);
              }
              // Display the default require message
              else {
                appendErrorMessage(element, defaultRequiredMessage);
              }
            } else if (!scopeElementModel.$valid) {
              // If there is a custom validation message add it
              if ("invalid-message" in element.attributes) {
                appendErrorMessage(element, element.attributes['invalid-message'].value);
              }
              // Display the default error message
              else {
                appendErrorMessage(element, defaultInvalidMessage);
              }
            }
          }
        }

        function generateErrorMessage(messageText) {
          return "<label class='control-label has-error validationMessage'>" + scope.$eval(messageText) + "</label>";
        }

        function appendErrorMessage(element, messageText) {
          if ("append-to" in element.attributes) {
            var appendTo = element.attributes['append-to'].value;
            if (appendTo === 'parent') {
              angular.element(element).parent().append(generateErrorMessage(messageText));
            }
            else {
              // fallback to default
              angular.element(element).after(generateErrorMessage(messageText));
            }
          }
          else {
            // default append after element
            angular.element(element).after(generateErrorMessage(messageText));
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
          var $element = angular.element(element);
          var validator_group = 'validator-group' in element.attributes && element.attributes['validator-group'].value;
          var $validator_group = $element.closest('.' + validator_group);
          var validator_group_elements = 'validator-group-elements' in element.attributes && element.attributes['validator-group-elements'].value;
          if (validator_group_elements && !validator_group) {
            throw new Error('You must define "validator-group" which contains "validator-group-elements"');
          }

          // Make sure the element is a form field and not a button for example
          // Only form fields should have names.
          if (!(element.name in scopeForm)) {
            return;
          }
          var formField = scopeForm[element.name];

          // Always remove validation classes
          $element.parent().removeClass('has-error');

          // This is extra for users wishing to implement the .has-error class on the field itself
          // instead of on the parent element. Note that Bootstrap requires the .has-error class to be on the parent element
          $element.removeClass('has-error');

          // remove validation class from 'validator-group' if it defined
          if ($validator_group.length) {
            $validator_group.removeClass('has-error');
          }

          // Only add validation classes if the field is $dirty or the form has been submitted
          if (formField.$dirty || scope[element.form.name].submitted) {
            if (formField.$invalid) {
              $element.parent().addClass('has-error');

              // This is extra for users wishing to implement the .has-error class on the field itself
              // instead of on the parent element. Note that Bootstrap requires the .has-error class to be on the parent element
              $element.addClass('has-error');

              // add validation class for element with 'validator-group' class if defined
              if ($validator_group.length) {
                $validator_group.addClass('has-error');
              }
            }
            else if (validator_group_elements) {
              var groupElements = $validator_group.find(validator_group_elements);
              if (!groupElements.length) {
                throw new Error('Can not find elements by selector="'+validator_group_elements+'" in validator-group="'+validator_group+'" ');
              }
              else {
                angular.forEach(groupElements, function (groupElement) {
                  var field = scopeForm[groupElement.name];
                  if (!field) {
                    throw new Error('Can not find element with name="'+groupElement.name+'" in validator-group="'+validator_group+'" ');
                  }
                  if (field.$invalid) {
                    return $validator_group.addClass('has-error');
                  }
                });
              }
            }
          }
        }
      }
    };
  }
);