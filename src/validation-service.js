var ruleRegex = /^(.+?)\[(.+)\]$/,
       numericRegex = /^[0-9]+$/,
       integerRegex = /^\-?[0-9]+$/,
       decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,
       emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
       alphaRegex = /^[a-z]+$/i,
       alphaNumericRegex = /^[a-z0-9]+$/i,
       alphaDashRegex = /^[a-z0-9_\-]+$/i,
       naturalRegex = /^[0-9]+$/i,
       naturalNoZeroRegex = /^[1-9][0-9]*$/i,
       ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
       base64Regex = /[^a-zA-Z0-9\/\+=]/i,
       numericDashRegex = /^[\d\-\s]+$/,
       urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
       dateRegex = /\d{4}-\d{1,2}-\d{1,2}/;

       

var validations = {
    url: function(input){

    },
    email: function(input){
        
    },
    emailStrict: function(input){

    },
    ssn: function(input){

    },
    phone: function(input){
        
    },
    phoneUSA: function(input){
        
    },
    passwordWeak: function(input){
        
    },
    passwordNormal: function(input){
        
    },
    passwordSecure: function(input){
        
    },
    valid_credit_card: function(input){
        // see: http://rickharrison.github.io/validate.js/
    }
};
