# Angular-Validator 
[![Build Status](https://travis-ci.org/turinggroup/angular-validator.png)](https://travis-ci.org/turinggroup/angular-validator)

Angular-Validator is an easy to use, powerful and lightweight AngularJS validation directive.

## Demo
[Check out the demo!](http://plnkr.co/edit/XbDYKrM2QUf8g1ubTHma?p=preview)

## Features
* Validate using REGEX, HTML, or custom validation functions
* Works seamlessly with native Angular and native HTML5 validation
* Choose when to validate elements, on per-element basis. Choose between on form `submission`, `blur` or `dirty`(change)
* Supports custom validation message templates and UI placement using Angular's native `ngMessages` directive. 
* All validation states and validation messages are accessible through `$scope.yourFormName.elementName`. 
* Prevents submission if the form is invalid
* Built in `reset()` form method
* Supports multi-field dependent validation (one field depends on another such as password matching)
* Works with Bootstrap out of the box (although Bootstrap is not required)
* Optionally adds `.has-error` classes to invalid form and message message elements so you don't have too.
* Supports form invalid message service where manage invalid messages in one place and save code in HTML


## Why?
Despite Angular's awesomeness, validation in Angular is still a annoying. Surprisingly there are no seamless, user-friendly, well written Angular validation tools. Unlike other Angular validation tools, Angular-Validator works with out-of-the-box Angular and HTML5 validation, directives and attributes, allowing your forms to work well with browser and other Javascript code. 

## Installation
1. Using bower:  `bower install tg-angular-validator`.
2. Include `angular-validator.min.js`.
3. Add `angularValidator` as a dependency of your Angular module.

## Usage

**Basic usage for required fields**
```
<input  type = 'text'
        ng-model = 'firstName' 
        required>
```

**Usage with a custom validator function**
```
<input  type = 'text'
        ng-model = 'firstName'
        validator = 'myCustomValidationFunction(firstName)'>
```

**Usage with validation on blur**
```
<input  type = 'text'
        ng-model = 'firstName'
        validate-on='blur'
        validator = 'myCustomValidationFunction(firstName)'>
```

**Usage with validation on dirty**
```
<input  type = 'text'
        ng-model = 'firstName'
        validate-on='dirty'
        validator = 'myCustomValidationFunction(firstName)'>
```

**Usage with custom validator literal**
```
<input  type = 'text'
        ng-model = 'firstName'
        validator = 'firstName === 'john''>
```

**Usage with REGEX and required**
```
<input  type = 'text'
        ng-model = 'firstName'
        ng-pattern = '\John\'
        required>
```

**Usage with custom error message text**
```
<input  type = 'text'
        ng-model = 'firstName'
        ng-pattern = '\John\'
        invalid-message = "Please enter `John`'"
        required-message = "'First name is required'"
        required>
```

**Usage with conditional invalid/required message text**
```
<input  type = 'text'
        ng-model = 'firstName'
        validator= 'customValidationFunction(firstName) === true'
        invalid-message = 'customValidationMessage(firstName)'
        required-message = 'cstomValidationFunction(firstName)'
        required>
```
* Note that the validator and the message function do not need to be the same function. If you choose to make them the same function make sure to return `true` on valid input.  

**Setting up the form**
```
<form novalidate angular-validator angular-validator-submit='myFunction(formName)' name='formName'>
    <button type='submit'>Submit</button>
</form>
```
Use `angular-validator-submit` to specify the function to be called when the form is submitted. Note that the function is not called if the form is invalid.

**Use form invalid message service**
```
<form novalidate angular-validator invalid-message='customMessage' angular-validator-submit='submitMyForm()'>
        <input  type='text'
                name='firstName'
                class='form-control'
                validate-on='dirty'
                ng-model='firstName'
                ng-maxlength='5'>
</form>
```
Use `invalid-message` on form element to provide the name of the service in which invalid messages are managed. You need to provide a `message` function in your service, which returns the messages you defined. Form invalid message service saves repetitive code in HTML because you do not need to use invalid-message attribute on every field. Please see the demo for examples.

**Resetting the form**
```
myFormName.reset()
```
You need to include a `name` attribute on the form to use this. 


**Validity API**
Uses standard Angular `$valid` and `$invalid` properties so that it can work with core angular and third party libraries!
```
formName.$invalid
formName.$valid
elementName.$valid
elementName.$invalid
elementName.$angularValidator
```

## FAQ
**It's not working!?**
If you have names on your elements make sure they are unique. Make sure you have properly followed the installation instructions.

**How do I display success messages/classes?**
The library does not currently support success classes and messages. Feel free to contribute.

**What if I want error messages to display before the user types anything?**
This feature is not yet built, feel free to contribute.

**What if I want to disable the submit button if the form is invalid?**
You can add `ng-disabled='formName.$invalid'` on the submit button.


## CONTRIBUTING
See CONTRIBUTING.md

## License
MIT
