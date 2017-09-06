/*********************************************/
/* INITIALIZE */
/*********************************************/
/**
 * Enterprise Portal Team 2016 JS/CSS Build
 * @author Gary Storey ( gary.storey@macys.com )
 */

'use strict';

var gulp = require('gulp');
var gp = require('gulp-load-plugins')(); //*1
var cfg = require('./config/gulp.config.js')();
var sp = require('./config/sp.config.js')();


/**
 * JSON Object containing options to pass to "gulp-rename" plugin
 * @property {json} renameOptions options to pass to "gulp-rename" plugin
 */
var renameOptions = {
    suffix: '.min'
};


var spCopyJSPath = sp.driveLetter+sp.paths.js.start+sp.env+sp.paths.js.end;
var spCopyCSSPath = sp.driveLetter+sp.paths.css+sp.env+'\\';


/**
 * Generic Error handler for each task via "gulp-plumber" plugin
 * @property {json} plumberOptions options for the "gulp-plumber" plugin including error handling function
 */
var plumberOptions = { //*2
    errorHandler: function (err) {
        gp.notify.onError({
            title: 'JS Core Error',
            message: 'Error: <%= error.message %>'
        })(err);
        log(err.message);
        this.emit('end');
    }
};

/**
 * Basic console.log for terminal
 * @function log
 * @param {string} txt Information to log to console
 */
var log = function (txt) {
/* eslint-disable no-undef, no-console */
    console && console.log(txt);
/* eslint-enable no-undef, no-console */
}

/*********************************************/
/*********************************************/
/*********************************************/


/*********************************************/
/* DEFINE JAVASCRIPT TASKS */
/*********************************************/

/**
 * Builds the Core JS file. Includes,linting, concatination, minification and copying the files.
 * @function JS-Core
 */
gulp.task('JS-Core', function () {

    return gulp.src(cfg.input.js.core)
        .pipe(gp.plumber(plumberOptions))
        .pipe(gp.eslint())
        .pipe(gp.eslint.format())
        .pipe(gp.eslint.failAfterError())
        .pipe(gp.deporder())
        .pipe(gp.concat(cfg.output.js.core.filename))
        .pipe(gulp.dest(cfg.output.js.core.destination))
        .pipe(gp.uglify())
        .pipe(gp.rename(renameOptions))
        .pipe(gulp.dest(cfg.output.js.core.destination))
//        .pipe(gp.shell(['cmd\\copy.cmd ept.core.* '+sp.serverName+' '+sp.driveLetter+' "'+spCopyJSPath+'"']))
        .pipe(gp.notify('JS Core file processed successfully.'))
        .pipe(gp.connect.reload());
});

/**
 * Builds the MasterPage JS file. Includes,linting, concatination, minification and copying the files.
 * @function JS-Masterpage
 */
gulp.task('JS-Masterpage', function () {
    return gulp.src(cfg.input.js.mp)
        .pipe(gp.plumber(plumberOptions))
        .pipe(gp.eslint())
        .pipe(gp.eslint.format())
        .pipe(gp.eslint.failAfterError())
        .pipe(gp.deporder())
        .pipe(gp.concat(cfg.output.js.mp.filename))
        .pipe(gulp.dest(cfg.output.js.mp.destination))
        .pipe(gp.uglify())
        .pipe(gp.rename(renameOptions))
        .pipe(gulp.dest(cfg.output.js.mp.destination))
//        .pipe(gp.shell(['cmd\\copy.cmd ept.masterpage.* '+sp.serverName+' '+sp.driveLetter+' "'+spCopyJSPath+'"']))
        .pipe(gp.notify('JS Masterpage file processed successfuly.'))
        .pipe(gp.connect.reload());
});

/**
 * Builds the stand alone Tiles JS file. Includes,linting, concatination, minification and copying the files.
 * @function JS-Tiles
 */
gulp.task('JS-Tiles', function () {
    return gulp.src(cfg.input.js.tiles)
        .pipe(gp.plumber(plumberOptions))
        .pipe(gp.eslint.format())
        .pipe(gp.eslint.failAfterError())
        .pipe(gp.deporder())
        .pipe(gp.concat(cfg.output.js.tiles.filename))
        .pipe(gulp.dest(cfg.output.js.tiles.destination))
        .pipe(gp.uglify())
        .pipe(gp.rename(renameOptions))
        .pipe(gulp.dest(cfg.output.js.tiles.destination))
        .pipe(gp.notify('Tiles file processed successfuly.'))
        .pipe(gp.connect.reload());
});


/*********************************************/
/*********************************************/
/*********************************************/


/*********************************************/
/* DEFINE DOCUMENTATION TASKS */
/*********************************************/

/**
 * Re-builds the documentation for the Core JS library.
 * @function JS-CoreDoc
 */
gulp.task('JS-CoreDoc', function () {
    var config = require('./config/coreDocConfig.json');
    return gulp.src(cfg.output.js.core.destination + '/' + cfg.output.js.core.filename)
        .pipe(gp.plumber(plumberOptions))
        .pipe(gp.jsdoc3(config))
        .pipe(gp.notify('JS Core file Documentation created.'));
});

/**
 * Re-builds the documentation for the Masterpage JS library.
 * @function JS-MPDoc
 */
gulp.task('JS-MPDoc', function () {
    var config = require('./config/mpDocConfig.json');
    return gulp.src(cfg.output.js.mp.destination + '/' + cfg.output.js.mp.filename)
        .pipe(gp.plumber(plumberOptions))
        .pipe(gp.jsdoc3(config))
        .pipe(gp.notify('JS Masterpage file Documentation created.'));
});

/**
 * Re-builds the documentation for the Build file.
 * @function JS-BuildDoc
 */
gulp.task('JS-BuildDoc', function () {
    var config = require('./config/buildDocConfig.json');
    return gulp.src(cfg.output.js.build.destination + '/' + cfg.output.js.build.filename)
        .pipe(gp.plumber(plumberOptions))
        .pipe(gp.jsdoc3(config))
        .pipe(gp.notify('JS Build file Documentation created.'));
});


/*********************************************/
/*********************************************/
/*********************************************/


/*********************************************/
/* DEFINE CSS TASKS */
/*********************************************/

/**
 * Re-builds the desktop (style.css) css file.
 * @function CSS-Desktop
 */
gulp.task('CSS-Desktop', function () {
    return gulp.src(cfg.input.css.desktop.filename)
        .pipe(gp.plumber(plumberOptions))
        .pipe(gp.sass())
        .pipe(gp.autoprefixer())
        .pipe(gp.cssfmt())
        .pipe(gulp.dest(cfg.output.css.desktop.destination))
        .pipe(gp.cleanCss({compatibility: 'ie10'}))
        .pipe(gp.rename(renameOptions))
        .pipe(gulp.dest(cfg.output.css.desktop.destination))
        .pipe(gp.shell(['cmd\\copy.cmd style.* '+sp.serverName+' '+sp.driveLetter+' "'+spCopyCSSPath+'"']))
        .pipe(gp.notify('Desktop SCSS files processed successfuly.'))
        .pipe(gp.connect.reload());
});

/**
 * Re-builds the Tiles (tiles.css) css file.
 * @function CSS-Tiles
 */
gulp.task('CSS-Tiles', function () {
    return gulp.src(cfg.input.css.tiles.filename)
        .pipe(gp.plumber(plumberOptions))
        .pipe(gp.sass())
        .pipe(gp.autoprefixer())
        .pipe(gp.cssfmt())
        .pipe(gulp.dest(cfg.output.css.tiles.destination))
        .pipe(gp.cleanCss({
            compatibility: 'ie10'
        }))
        .pipe(gp.rename(renameOptions))
        .pipe(gulp.dest(cfg.output.css.tiles.destination))
        .pipe(gp.notify('Tiles SCSS files processed successfuly.'))
        .pipe(gp.connect.reload());
});


/*********************************************/
/*********************************************/
/*********************************************/


/*********************************************/
/* DEFINE HELPER TASKS */
/*********************************************/

/**
 * Creates a dev web server on localhost http://localhost:8080/ pointing to the "pages" folder
 * @function server
 */
gulp.task('server', function () {
    gp.connect.server({
        root: 'pages',
        livereload: true
    });
});

/**
 * Task that Runs during postinstall (package.json) to do an initial build and create documentation
 * @function initial
 */
gulp.task('initial', ['JS-Core','JS-Masterpage','JS-Tiles','CSS-Desktop','CSS-Tiles'], function(){
    log('Initial confguration completed....')
});


/**
 * Watches all JS and SCSS files for changes and runs tasks automatically.
 * @function watch
 */
gulp.task('watch', function () {
    gulp.watch(cfg.input.js.core, ['JS-Core']);
    gulp.watch(cfg.input.js.mp, ['JS-Masterpage']);
    gulp.watch(cfg.input.js.tiles, ['JS-Tiles']);
    gulp.watch(cfg.input.css.desktop.monitor, ['CSS-Desktop']);
    gulp.watch(cfg.input.css.desktop.filename, ['CSS-Desktop']);
    gulp.watch(cfg.input.css.tiles.monitor, ['CSS-Tiles']);
    gulp.watch(cfg.input.css.tiles.filename, ['CSS-Tiles']);
});


/*********************************************/
/*********************************************/
/*********************************************/


/*********************************************/
/* DEFINE DEFAULT TASK */
/*********************************************/

/**
 * Runs automatically when "gulp" is executed. Currently, watches file and starts dev server
 * @function default
 */
gulp.task('default', ['watch', 'server']);


/*********************************************/
/*********************************************/
/*********************************************/


/*********************************************/
/* APPENDIX */
/*********************************************/
/*

//*1 -  The gulp-load-plugins allows you to load all of the gulp plugins listed in the
        package.json file.  Without it, you would need to require each of them individually.
        For example,   var concat = require('gulp-concat')   .  Just easier to use this instead.


//*2 -  The gulp-plumber plugin allows gulp to keep running after an error occurs. By default,
        gulp would just stop running.  This sucks when you have it watching your files for
        changes.

*/
/*********************************************/
/*********************************************/
/*********************************************/
