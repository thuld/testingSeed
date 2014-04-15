(function(alfa, undefined){
    'use strict';
    
    var projectNumberTempl = '<%= year %>-000<%= main %>-0000<%= sub %>';
    
    ///
    /// Invoked for the onload-event of the form
    ///
    function init() {
        populateProjectNumber();
    }

    ///
    /// Simple mock for an auto-number plugin
    ///
    function populateProjectNumber() {

        var projectnumberAttr = Xrm.Page.getAttribute('ap_projectnumber'),
            projectnumber = projectnumberAttr.getValue();

        if( projectnumber === null) {

            getNextProjectNumber.then(projectnumberAttr.setValue);

            // the attr. is displayed in read-only mode on the form
            projectnumberAttr.setSubmitMode('always');
        }
    }

    ///
    /// See JSHint Reference for details
    /// http://www.jshint.com/docs/options/
    ///
    function jsHintPlayground() {

        /* "unused": true */
        var unUsedVariable = 'value';
        
        /* "latedef": true */
        foo1 = 'value';
        var foo1;
        
        /* "undef": true */
        console.log( undefefinedVaraible );

        /* "noarg": true */
        console.log( arguments.caller );

        /* "forin": true */
        for( var key in CrmFetchKit ) {
            // if (CrmFetchKit.hasOwnProperty( key ) ) {
                console.log( key );
            //}
        }
    }

    ///
    /// Calculates the next available proejct-number
    ///
    function getNextProjectNumber() {

        var fetchxml = [ 
            '<fetch version="1.0" output-format="xml-platform" mapping="logical" count="1" distinct="false">',
            '  <entity name="alfa_project">',
            '      <attribute name="alfa_projectid" />',
            '      <attribute name="alfa_project_number" />',
            '    <order attribute="alfa_project_number" descending="false" />',
            '  </entity>',
            '</fetch>'].join('');

        return CrmFetchKit
                .Fetch(fetchxml)
                .then(calcuNextProjectNumber);
    }

    ///
    /// Base on the last project is the next project-number calculated
    /// Warning: Will cause congruency issues when two proejcts are opened
    ///
    function calcuNextProjectNumber( topProjects ) {

        var next = null,
            projectNumberObject = null;

        if( topProjects.length > 0 ) {

            projectNumberObject = parseProejctNumber( topProjects[0] );

            next = _.template(projectNumberTempl, { 
                year: new Date().getFullYear(),
                main: ( parseInt(projectNumberObject.main, 10) + 1 ),
                sub: ( parseInt(projectNumberObject.sub, 10) + 1)
            });
        }
        else {

            next = _.template(projectNumberTempl, { 
                year: new Date().getFullYear(),
                main: ( projectNumberObject.main + 1 ),
                sub: ( projectNumberObject.sub + 1 )
            });
        }

        return next;
    }

    ///
    /// Transforms the given project-number string into an 
    /// project-number object
    ///
    function parseProejctNumber( projectNumber ) {

        var parts = projectNumber.split('-');

        return {
            year: parts[0],
            main: parseInt( parts[1], 10),
            sub: parseInt( parts[2], 10)
        };
    }

    ///
    /// Public API
    ///
    alfa.main = alfa.main || {};
    alfa.main.project = {
        init: init
    };

}( window.alfa = window.alfa ||{}));