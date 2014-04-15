(function (alfa, undefined){
    "use strict";

    function init() {

    }

    function validateSave(){

        var isValid = true;

        return isValid;
    }

    ///
    /// Public API
    ///
    alfa.main = alfa.main || {};
    alfa.main.account = {
        init: init,
        validateSave: validateSave
    };

}( window.alfa = window.alfa ||{} ));