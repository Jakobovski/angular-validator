# Angular-Validator 
[![Build Status](https://travis-ci.org/turinggroup/angular-validator.png)](https://travis-ci.org/turinggroup/angular-validator)

Angular-Validator is an easy to use, powerful and lightweight AngularJS validation directive.

## Demo
[Check out the demo!](http://plnkr.co/edit/XbDYKrM2QUf8g1ubTHma?p=preview)

## Features
* Validate using regex, HTML5, or custom validation functions.
* Works seamlessly with all native AngularJS validation directives and native HTML5 validation attributes.
* Supports custom validation message templates and placement using Angular's native `ngMessages` directive.
* Choose when to validate elements, on per-element basis. Choose between on form `submission`, `blur` or `dirty`(change).
* All validation states and validation messages are accessible through `$scope.yourFormName.elementName`. 
* Prevents submission if the form is invalid
* Built in `reset()` form method
* Supports multi-field dependent validation (one field depends on another such as password matching)
* Works with Bootstrap out of the box (although Bootstrap is not required)
* Optionally adds `.has-error` classes to invalid form and message message elements so you don't have too.
* Supports form invalid message service where manage invalid messages in one place and save code in HTML

## Why?
Despite Angular's awesomeness, validation in Angular is still annoying. Surprisingly there are no seamless, user-friendly, well written Angular validation tools. Unlike other Angular validation tools, Angular-Validator works with out-of-the-box Angular and HTML5 validation, directives and attributes, allowing your forms to work well with the browser and other Javascript code. 

## Installation
1. Using bower:  `bower install tg-angular-validator`.
2. Include `angular-validator.min.js`.
3. Add `angularValidator` as a dependency of your Angular module.

## Usage

**Basic usage for required fields**
```
<input  type = "text"
        name = "firstName"
        ng-model = "person.firstName"
        required>
```

**Usage with a custom validator function**
```
<input  type = "text"
        name = "firstName"
        ng-model = "person.firstName"
        validator = "myValidationFunction(person.firstName)">
```

**Usage with validation on blur**
```
<input  type = "text"
        name = "firstName"
        ng-model = "person.firstName"
        validate-on="blur"
        validator = "myValidationFunction(person.firstName)">
```

**Usage with validation on dirty**
```
<input  type = "text"
        name = "firstName"
        ng-model = "person.firstName"
        validate-on="dirty"
        validator = "myValidationFunction(person.firstName)">
```

**Usage with custom validator literal**
```
<input  type = "text"
        name = "firstName"
        ng-model = "person.firstName"
        validator = "person.firstname === 'john'">
```

**Usage with REGEX and required**
```
<input  type = "text"
        name = "firstName"
        ng-model = "person.firstName"
        ng-pattern = "\regex\"
        required>
```

**Usage with custom error message text**
```
<input  type = "text"
        name = "firstName"
        ng-model = "person.firstName"
        ng-pattern = "\regex\"
        invalid-message = "'Please enter the word regex'"
        required-message = "'First name is required'"
        required>
```

**Usage with conditional invalid/required message text**
```
<input  type = "text"
        name = "firstName"
        ng-model = "person.firstName"
        validator= "myValidationFunction(person.firstName) === true"
        invalid-message = "myValidationFunction(person.firstName)"
        required-message = "myValidationFunction(person.firstName)"
        required>
```
* Note that the validator and the message function do not need to be the same function. If you choose to make them the same function make sure to return `true` on valid input.  

**Setting up the form**
```
<form novalidate angular-validator angular-validator-submit='myOnSubmitFunction()' name='myFormName'>
    ....
    ....
    <button type='submit'>Submit</button>
</form>
```
Use `angular-validator-submit` to specify the function to be called when the form is submitted. Note that the function is not called if the form is invalid.


**Use form invalid message service**
```
<form novalidate angular-validator invalid-message='customMessage' angular-validator-submit='submitMyForm()' name='myFormName'>
        <input  type='text'
                name='firstName'
                validate-on='dirty'
                ng-model='firstName'>
</form>
```
Use `invalid-message` on form element to provide the name of the service in which invalid messages are managed. You need to provide a `message` function in your service, which returns the messages you defined. Form invalid message service saves repetitive code in HTML because you do not need to use invalid-message attribute on every field. Please see the demo for examples.

**Resetting the form**
```
myFormName.reset()
```
*You need to include a `name` attribute on the form to use this.*


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
Make sure you have assigned a unique name to each form element as well as the form itself. Make sure you have properly followed the installation instructions.

**Why pass value to custom validator functions?**
Passing the value to the custom validator function allows the function to be easier to test.

**How do I display success messages/classes?**
The library does not currently support success classes and messages. Feel free to contribute.

**What if I want error messages to display before the user types anything?**
You are using the wrong library.

**What if I want to disable the submit button if the form is invalid?**
You can add `ng-disabled="myForm.$invalid"` on the submit button.


## CONTRIBUTING
See CONTRIBUTING.md

## License
MIT
