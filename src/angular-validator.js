angular.module('angularValidator', []);

angular.module('angularValidator').directive('angularValidator',
    function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, fn) {

                // This is the DOM form element
                var DOMForm = angular.element(element)[0];

                // an array to store all the watches for form elements
                var watches = [];

                // This is the the scope form model
                // All validation states are contained here
                var form_name = DOMForm.attributes['name'].value;
                var scopeForm = scope[form_name];

                // Set the default submitted state to false
                scopeForm.submitted = false;
                
                // Watch form length to add watches for new form elements
                scope.$watch(function(){return Object.keys(scopeForm).length;}, function(){
                    // Destroy all the watches
                    // This is cleaner than figuring out which items are already being watched and only un-watching those.
                    angular.forEach(watches, function(watch){watch();});
                    setupWatches(DOMForm);
                });
              

                // Intercept and handle submit events of the form
                element.on('submit', function(event) {
                    event.preventDefault();
                    scope.$apply(function() {
                        scopeForm.submitted = true;
                    });

                    // If the form is valid then call the function that is declared in the angular-validator-submit attribute on the form element
                    if (scopeForm.$valid) {
                        scope.$apply(function() {
                            scope.$eval(DOMForm.attributes["angular-validator-submit"].value);
                        });
                    }
                });


                scopeForm.reset = function(){
                    // Clear all the form values
                    for (var i = 0; i < DOMForm.length; i++) {
                        if (DOMForm[i].name){
                            scopeForm[DOMForm[i].name].$setViewValue("");
                            scopeForm[DOMForm[i].name].$render();
                        }
                    }
                    scopeForm.submitted = false;
                    scopeForm.$setPristine();
                };


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


                // Setup $watch on a single formfield
                function setupWatch(elementToWatch) {
                    // If element is set to validate on blur then update the element on blur
                    if ("validate-on" in elementToWatch.attributes && elementToWatch.attributes["validate-on"].value === "blur") {
                        angular.element(elementToWatch).on('blur', function() {
                            updateValidationMessage(elementToWatch);
                            updateValidationClass(elementToWatch);
                        });
                    }

                    var watch = scope.$watch(function() {
                            return elementToWatch.value + elementToWatch.required + scopeForm.submitted + checkElementValidity(elementToWatch) + getDirtyValue(scopeForm[elementToWatch.name]) + getValidValue(scopeForm[elementToWatch.name]);
                        },
                        function() {
                           
                            if (scopeForm.submitted){
                                updateValidationMessage(elementToWatch);
                                updateValidationClass(elementToWatch);
                            }
                            else {
                                // Determine if the element in question is to be updated on blur
                                var isDirtyElement = "validate-on" in elementToWatch.attributes && elementToWatch.attributes["validate-on"].value === "dirty";

                                if (isDirtyElement){
                                    updateValidationMessage(elementToWatch);
                                    updateValidationClass(elementToWatch);
                                }
                                // This will get called in the case of resetting the form. This only gets called for elements that update on blur and submit.
                                else if (scopeForm[elementToWatch.name] && scopeForm[elementToWatch.name].$pristine){
                                    updateValidationMessage(elementToWatch);
                                    updateValidationClass(elementToWatch);
                                }
                            }

                        });

                    watches.push(watch);
                }


                // Returns the $dirty value of the element if it exists
                function getDirtyValue(element) {
                    if (element) {
                        if ("$dirty" in element) {
                            return element.$dirty;
                        }
                    }
                }


                function getValidValue(element) {
                    if (element) {
                        if ("$valid" in element) {
                            return element.$valid;
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

                    var defaultRequiredMessage = function() {
                        return "<i class='fa fa-times'></i> Required";
                    };
                    var defaultInvalidMessage = function() {
                        return "<i class='fa fa-times'></i> Invalid";
                    };

                    // Make sure the element is a form field and not a button for example
                    // Only form elements should have names. 
                    if (!(element.name in scopeForm)) {
                        return;
                    }

                    var scopeElementModel = scopeForm[element.name];

                    // Remove all validation messages 
                    var validationMessageElement = isValidationMessagePresent(element);
                    if (validationMessageElement) {
                        validationMessageElement.remove();
                    }


                    // Only add validation messages if the form field is $dirty or the form has been submitted
                    if (scopeElementModel.$dirty || (scope[element.form.name] && scope[element.form.name].submitted)) {

                        if (scopeElementModel.$error.required) {
                            // If there is a custom required message display it
                            if ("required-message" in element.attributes) {
                                setErrorMessage(element, generateErrorMessage(element.attributes['required-message'].value));
                            }
                            // Display the default required message
                            else {
                                setErrorMessage(element, generateErrorMessage(defaultRequiredMessage));
                            }
                        } else if (!scopeElementModel.$valid) {
                            // If there is a custom validation message add it
                            if ("invalid-message" in element.attributes) {
                                setErrorMessage(element, generateErrorMessage(element.attributes['invalid-message'].value));
                            }
                            // Display the default error message
                            else {
                                setErrorMessage(element, generateErrorMessage(defaultInvalidMessage));
                            }
                        }
                    }
                }

                function setErrorMessage(element, message) {
                    var angularElement = angular.element(element);
                    var parentElement = angularElement.parent();

                    if (parentElement.hasClass('input-group'))
                        parentElement.after(message);
                    else
                        angularElement.after(message);
                }

                function generateErrorMessage(messageText) {
                    return "<label class='control-label has-error validationMessage'>" + scope.$eval(messageText) + "</label>";
                }


                // Returns the validation message element or False
                function isValidationMessagePresent(element) {
                    var formGroup = findFormGroup(element);

                    if (formGroup)
                        return elementHasValidationMessageChildren(formGroup);

                    return elementHasValidationMessageChildren(angular.element(element).parent());
                }

                function elementHasValidationMessageChildren(element) {
                    var elementSiblings = angular.element(element).children();

                    for (var i = 0; i < elementSiblings.length; i++) {
                        var angularElement = angular.element(elementSiblings[i]);

                        if (angularElement.hasClass("validationMessage")) {
                            return angular.element(angularElement);
                        }

                        var child = elementHasValidationMessageChildren(angularElement);

                        if (child)
                            return child;
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

                    // This is extra for users wishing to implement the .has-error class on the field itself
                    // instead of on the parent element. Note that Bootstrap requires the .has-error class to be on the parent element
                    angular.element(element).removeClass('has-error');
                    angular.element(element.parentNode).removeClass('has-error');

                    var formGroup = findFormGroup(element);
                    if (formGroup)
                        formGroup.removeClass('has-error');


                    // Only add/remove validation classes if the field is $dirty or the form has been submitted
                    if (formField.$dirty || (scope[element.form.name] && scope[element.form.name].submitted)) {
                      if (formField.$invalid) {

                          if (formGroup)
                              formGroup.addClass('has-error');

                          angular.element(element.parentNode).addClass('has-error');

                            // This is extra for users wishing to implement the .has-error class on the field itself
                            // instead of on the parent element. Note that Bootstrap requires the .has-error class to be on the parent element
                            angular.element(element).addClass('has-error');
                        }
                    }
                }

                // Try to find the form-group parent element of the element
                function findFormGroup(element) {
                    var angularElement = angular.element(element);

                    if (angularElement.hasClass('form-group')) {
                        return angularElement;
                    }

                    return findFormGroup(angularElement.parent());
                }

            }
        };
    }
);
