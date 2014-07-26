# Angular-Validator 
[![Build Status](https://travis-ci.org/turinggroup/angular-validator.png)](https://travis-ci.org/turinggroup/angular-validator)


## What?
Angular-Validator is an easy to use, powerful and lightweight AngularJS validation directive.


## Why?
Despite Angular's awesomeness, validation in Angular is still a pain in the ass. Surprisingly there are no seemless, user-friendly, well written Angular validation tools. Unlike other Angular validation tools, Angular-Validator works with out-of-the-box Angular and HTML5 validation, directives and attributes, allowing your forms to work well with the browser and other Javascript code. 


## Features
* Validate using REGEX, required, or custom validation functions
* Show validation errors only after field is `$dirty` or the form is submitted
* Adds validation error/success messages as sibling elements
* Adds `.has-error` classes to invalid fields only after `$dirty` or form is submitted
* Adds `.has-error` classes to validation message
* Works with Bootstrap out of the box (although Bootstrap is not required)
* Supports multi-field dependent validation (one field depends on another such as password matching)
* Works with or without `novalidate`
* Prevents submission if the form is invalid


## Demo
[Check out the demo!](http://plnkr.co/edit/WwIW5GtHokTiwpe689S3?p=preview)


### Installation
*  Using bower and running `bower install angular-validator`
*  Using npm and running `npm install angular-validator`


## Usage

**Basic usage for required fields**
```
<input  type = "text"
        name = "firstName"
        ng-model = "form.firstName"
        required>
```


**Usage with a custom validator function**
```
<input  type = "text"
        name = "firstName"
        ng-model = "form.firstName"
        validator = "myCustomValidationFunction(form.firstName)">
```


**Usage with custom validator literal**
```
<input  type = "text"
        name = "firstName"
        ng-model = "form.firstName"
        validator = "form.firstname === 'john'">
```


**Usage with REGEX and required**
```
<input  type = "text"
        name = "firstName"
        ng-model = "form.firstName"
        ng-pattern = "\regex\"
        required>
```

**Usage with custom error message text**
```
<input  type = "text"
        name = "firstName"
        ng-model = "form.firstName"
        ng-pattern = "\regex\"
        invalid-message = "'Please enter the word regex'"
        required-message = "'First name is required'"
        required>
```


**Usage with conditional invalid/required message text**
```
<input  type = "text"
        name = "firstName"
        ng-model = "form.firstName"
        validator= "myCustomValidationFunction(form.firstName) === true"
        invalid-message = "myCustomValidationMe(form.firstName)"
        required-message = "myCustomValidationFunction(form.firstName)"
        required>
```
* Note that the validator and the message function do not need to be the same function. If you choose to make them the same function make sure to return `true` on valid input.  




**Setting up the form**
```
<form novalidate angular-validator angular-validator-submit="myFunction(myBeautifulForm)" name="myBeautifulForm">
    <input>
    <select></select>
    ....
    <button type="submit">Submit</button>
</form>
```
Use `angular-validator-submit` to specify the function to be called when the form is submitted. Note that the function is not called if the form is invalid.



**Validty API**
Uses standard Angular `$valid` and `$invalid` properties
```
myForm.$invalid
myForm.$valid
myElement.$valid
myElement.$invalid
myElement.$angularValidator
```


## FAQ
**It's not working!?**
Make sure you have assigned a unique name attribute to each element

**Why pass value to custom validator functions?**
Passing the value to the custom validator function allows the function to be easier to test.


**How do I display success messages/classes?**
The library does not currently support success classes and messages. Feel free to contribute.


**What if I want error messages to display before the user types anything?**
You are using the wrong library.


**What if I want to disable the submit button if the form is invalid?**
You can use `ng-disabled=myForm.$invalid` on the submit button.




## License
MIT
