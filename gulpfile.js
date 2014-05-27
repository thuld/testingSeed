"use strict";

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanup = require('gulp-clean');
var notify = require("gulp-notify");

// Generates complexity analysis reports
var plato = require('gulp-plato');

var mochaPhantomJS = require('gulp-mocha-phantomjs');
var map = require('map-stream');

// apply static code analysis
gulp.task('lint', function(){

    return gulp.src( ['./lib/*.js'] )
        .pipe( jshint( '.jshintrc' ) )
        .pipe( jshint.reporter( stylish ) )
        .pipe( map( function ( file, callback ) {
            
            callback( !file.jshint.success, file );
        }));
});

// apply minifier
gulp.task('compress', ['cleanup','lint'], function(){

    var notifierOptions = {
        message: 'Compress completed',
        onLast: true
    };
    
    return gulp.src( ['./lib/*.js'] )
        .pipe( uglify() )
        .pipe( rename( { suffix: ".min" } ) )
        .pipe( gulp.dest('./lib'))
        .pipe( notify( notifierOptions ) );
});

// delete the compressed files
gulp.task('cleanup', function(){

    var notifierOptions = {
        message: 'Cleanup completed',
        onLast: true
    };

    return gulp.src('./lib/*.min.js')
        .pipe( cleanup( { read: false } ) )
        .pipe( notify( notifierOptions ));
});

// Generates Plato complexity analysis
gulp.task('plato', function() {  
    gulp.src('./lib/*')
        .pipe( plato('report', {
            jshint: {
                options: {
                    strict: false
                }
            },
            complexity: {
                trycatch: true
            }
        }));
});

// run test without mocha:
//      mocha-phantomjs -R spec ./test/runner.html
gulp.task('test', function(){

    gulp.src('test/runner.html')
        .pipe( mochaPhantomJS( {reporter: 'spec'} ) );
});