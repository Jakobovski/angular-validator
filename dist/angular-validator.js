angular.module('angularValidator', []);

/*
* service
* grabs server side validation
* determines fields / failures
* passes to validity api
* needs to also pass message
*
* json output form scope
* see if we can force validation with validity
* */

angular.module('angularValidator')
	.service('angularValidator', ['$compile', 'alertGuy', function($compile, alertGuy) {
		var scope;
		var scopeForm;
		var form = {};
		var validation = {};
		var DOMForm;

		var angularValidator = {
			scope: scope,
			scopeForm: scopeForm,
			DOMForm: DOMForm,
			form: form,
			setForm: setForm,
			validation: validation,
			setValidation: setValidation,
			parseValidation: parseValidation,
			updateValidationMessage: updateValidationMessage
		};

		return angularValidator;

		/////

		function parseValidation() {

			var validationNoField = [];

			//set whole form to valid again
			angular.forEach(angularValidator.form, function(formElement) {
				if (formElement && formElement.$name && angularValidator.form[formElement.$name]) {
					angularValidator.form[formElement.$name].$setValidity(formElement.$name, true);
					angularValidator.form[formElement.$name].$render();
				}
			});
			//console.log(angularValidator.validation);

			// loop validation response from server to set invalid fields
			if(angularValidator.validation.details && angularValidator.validation.details.length > 0) {
				for (var i = 0, len = angularValidator.validation.details.length; i < len; i++) {
					var field = angularValidator.validation.details[i];
					// only apply to fields actually within the form scope
					if(angularValidator.form[field.field]) {
						// set validity to false
						angularValidator.form[field.field].$setValidity(field.field, false);
						// set form message
						if(field.description) {
							angular.element(angularValidator.DOMForm[field.field]).attr('invalid-message', field.description);
						}
					}
					// handle validation that did not match field on form
					else {
						validationNoField.push(field);
					}
				}
			}

			// handle errors not field specific

			if(validationNoField.length) {
				var error_desc = '';
				for (i = 0; i < validationNoField.length; i++) {
					error_desc += validationNoField[i].description+'.\n\n';
				}
				//alertGuy
				alertGuy.alert({
					title: angularValidator.validation.description,
					text: error_desc
				});
			}
		}

		function setValidation(validation) {
			angularValidator.validation = validation;
		}
		function setForm(form) {
			angularValidator.form = form;
		}

		//




		// Adds and removes an error message as a sibling element of the form field
		// depending on the validity of the form field and the submitted state of the form.
		// Will use default message if a custom message is not given
		function updateValidationMessage(element, formInvalidMessage) {

			var defaultRequiredMessage = function() {
				return "<i class='fa fa-times'></i> Required"; // TODO - make this lang compatible
			};
			var defaultInvalidMessage = function() {
				return "<i class='fa fa-times'></i> Invalid"; // TODO - make this lang compatible
			};

			// Make sure the element is a form field and not a button for example
			// Only form elements should have names.
			if (!(element.name in angularValidator.scopeForm)) {
				return;
			}

			var scopeElementModel = angularValidator.scopeForm[element.name];

			// Remove all validation messages
			var validationMessageElement = isValidationMessagePresent(element);
			if (validationMessageElement) {
				validationMessageElement.remove();
			}

			// Only add validation messages if the form field is $dirty or the form has been submitted
			if (scopeElementModel.$dirty || angularValidator.scopeForm.submitted) {

				if (scopeElementModel.$error.required) {
					// If there is a custom required message display it
					if ("required-message" in element.attributes) {
						angular.element(element).after($compile(generateErrorMessage(element.attributes['required-message'].value, scopeElementModel))(angularValidator.scope));
					}
					// Display the default required message
					else {
						angular.element(element).after($compile(generateErrorMessage(defaultRequiredMessage(), scopeElementModel))(angularValidator.scope));
					}
				} else if (!scopeElementModel.$valid) {
					// If there is a custom validation message add it
					if ("invalid-message" in element.attributes) {
						angular.element(element).after($compile(generateErrorMessage(element.attributes['invalid-message'].value, scopeElementModel))(angularValidator.scope));
					}
					// Display error message provided by custom service
					else if (formInvalidMessage) {
						angular.element(element).after($compile(generateErrorMessage(formInvalidMessage.message(scopeElementModel, element), scopeElementModel))(angularValidator.scope));
					}
					// Display the default error message
					else {
						angular.element(element).after($compile(generateErrorMessage(defaultInvalidMessage(), scopeElementModel))(angularValidator.scope));
					}
				}
			}
		}


		function generateErrorMessage(messageText, attrs) {
			return '<validation class="control-label has-error validationMessage">'
				+'<a class="btn btn-tiny btn-validation-error" ng-click="showValid.'+attrs.$name+' = !showValid.'+attrs.$name+'"></a>'
				+'<div class="sub-tooltip mod-validation-error ng-hide" ng-show="showValid.'+attrs.$name+'" ng-click="showValid.'+attrs.$name+' = !showValid.'+attrs.$name+'">'
				+'<p>' + messageText + '</p>'
				+'</div>'
				+'</validation>';
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


	}]);

angular.module('angularValidator').directive('angularValidator', ['$injector', '$parse', '$compile', 'angularValidator',
	function($injector, $parse, $compile, angularValidator) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs, fn) {
				var getRandomInt = function() {
					return Math.floor((Math.random() * 100000));
				};

				angularValidator.scope = scope;

				// For this directive to work the form needs a name attribute as well as every input element.
				// This function will add names where missing
				var need_to_recompile = false;

				// Iterate through all the children of the form element and add a `name` attribute to the ones
				// that are missing it.
				angular.forEach(element.find('input,select,textarea'), function(child_element) {
					child_element = $(child_element);
					if (!child_element.attr('name')) {
						child_element.attr('name', getRandomInt());
						console.log('WARNING! AngularValidator -> One of your form elements(<input>, <textarea>, <select>) is missing a name. We got your back and added a name, but if you want a pretty one you should add it yourself.');
						need_to_recompile = true;
					}
				});

				// Uses a ransom to prevent duplicate form names.
				if (!attrs.name) {
					element.attr('name', 'TGAV_FORM_' + getRandomInt());
					console.log('WARNING! AngularValidator -> Your form element(<form>) is missing a name. We got your back and added a name, but if you want a pretty one you should add it yourself.');
					need_to_recompile = true;
				}

				// We need to recompile so that the passed scope is updated with the new form names.
				if (need_to_recompile) {
					$compile(element)(scope);
					return;
				}

				// This is the DOM form element
				angularValidator.DOMForm = angular.element(element)[0];

				// an array to store all the watches for form elements
				var watches = [];

				// This is the the scope form model, it is created automatically by angular
				// All validation states are contained here
				// See: https://docs.angularjs.org/api/ng/directive/form
				angularValidator.scopeForm = $parse(attrs.name)(scope);

				// Set the default submitted state to false
				angularValidator.scopeForm.submitted = false;

				// Watch form length to add watches for new form elements
				scope.$watch(function() {
					return Object.keys(angularValidator.scopeForm).length;
				}, function() {
					// Destroy all the watches
					// This is cleaner than figuring out which items are already being watched and only un-watching those.
					angular.forEach(watches, function(watch) {
						watch();
					});
					setupWatches(angularValidator.DOMForm);
				});


				// Intercept and handle submit events of the form
				element.on('submit', function(event) {
					event.preventDefault();
					scope.$apply(function() {
						angularValidator.scopeForm.submitted = true;
					});

					angularValidator.setForm(angularValidator.scopeForm);
					angularValidator.parseValidation();

					// need to check if its been submitted for server side validation / already passed client side validation

					// If the form is valid then call the function that is declared in the angular-validator-submit attribute on the form element
					if (angularValidator.scopeForm.$valid || angularValidator.scopeForm.clientValid) {
						angularValidator.scopeForm.clientValid = true;
						scope.$apply(function() {
							scope.$eval(attrs['angularValidatorSubmit']);
						});
					}
				});

				// Clear all the form values. Set everything to pristine.
				angularValidator.scopeForm.reset = function() {
					angular.forEach(angularValidator.DOMForm, function(formElement) {
						if (formElement.name && angularValidator.scopeForm[formElement.name]) {
							angularValidator.scopeForm[formElement.name].$setViewValue("");
							angularValidator.scopeForm[formElement.name].$render();
						}
					});
					angularValidator.scopeForm.submitted = false;
					angularValidator.scopeForm.$setPristine();
				};


				// Setup watches on all form fields
				setupWatches(angularValidator.DOMForm);

				// Check if there is invalid message service for the entire form;
				// if yes, return the injected service; if no, return false;
				function hasFormInvalidMessage(formElement) {
					if (formElement && 'invalid-message' in formElement.attributes) {
						return $injector.get(formElement.attributes['invalid-message'].value);
					} else {
						return false;
					}
				}

				// Iterate through the form fields and setup watches on each one
				function setupWatches(formElement) {
					var formInvalidMessage = hasFormInvalidMessage(formElement);
					for (var i = 0; i < formElement.length; i++) {
						// This ensures we are only watching form fields
						if (i in formElement) {
							setupWatch(formElement[i], formInvalidMessage);
						}
					}
				}


				// Setup $watch on a single form element
				function setupWatch(elementToWatch, formInvalidMessage) {
					// If element is set to validate on blur then update the element on blur
					if ("validate-on" in elementToWatch.attributes && elementToWatch.attributes["validate-on"].value === "blur") {
						angular.element(elementToWatch).on('blur', function() {
							angularValidator.updateValidationMessage(elementToWatch, formInvalidMessage);
							updateValidationClass(elementToWatch);
						});
					}

					var watch = scope.$watch(function() {
							return elementToWatch.value + elementToWatch.required + angularValidator.scopeForm.submitted + checkElementValidity(elementToWatch) + getDirtyValue(angularValidator.scopeForm[elementToWatch.name]) + getValidValue(angularValidator.scopeForm[elementToWatch.name]);
						},
						function() {
							if (angularValidator.scopeForm.submitted) {
								angularValidator.updateValidationMessage(elementToWatch, formInvalidMessage);
								updateValidationClass(elementToWatch);
							} else {
								// Determine if the element in question is to be updated on blur
								var isDirtyElement = "validate-on" in elementToWatch.attributes && elementToWatch.attributes["validate-on"].value === "dirty";

								if (isDirtyElement) {
									angularValidator.updateValidationMessage(elementToWatch, formInvalidMessage);
									updateValidationClass(elementToWatch);
								}
								// This will get called in the case of resetting the form. This only gets called for elements that update on blur and submit.
								else if (angularValidator.scopeForm[elementToWatch.name] && angularValidator.scopeForm[elementToWatch.name].$pristine) {
									angularValidator.updateValidationMessage(elementToWatch, formInvalidMessage);
									updateValidationClass(elementToWatch);
								}
							}

						});

					watches.push(watch);
				}


				// Returns the $dirty value of the element if it exists
				function getDirtyValue(element) {
					if (element && "$dirty" in element) {
						return element.$dirty;
					}
				}

				// Returns the $valid value of the element if it exists
				function getValidValue(element) {
					if (element && "$valid" in element) {
						return element.$valid;
					}
				}


				function checkElementValidity(element) {
					// If element has a custom validation function
					if ("validator" in element.attributes) {
						// Call the custom validator function
						var isElementValid = scope.$eval(element.attributes.validator.value);
						angularValidator.scopeForm[element.name].$setValidity("angularValidator", isElementValid);
						return isElementValid;
					}
				}


				// Adds and removes .has-error class to both the form element and the form element's parent
				// depending on the validity of the element and the submitted state of the form
				function updateValidationClass(element) {
					// Make sure the element is a form field and not a button for example
					// Only form fields should have names.
					if (!(element.name in angularValidator.scopeForm)) {
						return;
					}
					var formField = angularValidator.scopeForm[element.name];

					// This is extra for users wishing to implement the .has-error class on the field itself
					// instead of on the parent element. Note that Bootstrap requires the .has-error class to be on the parent element
					angular.element(element).removeClass('has-error');
					angular.element(element.parentNode).removeClass('has-error');


					// Only add/remove validation classes if the field is $dirty or the form has been submitted
					if (formField.$dirty || angularValidator.scopeForm.submitted) {
						if (formField.$invalid) {
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
