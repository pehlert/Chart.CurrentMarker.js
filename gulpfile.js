var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    replace = require('gulp-replace'),
    insert = require('gulp-insert'),
    exec = require('child_process').exec,
    fs = require('fs'),
    package = require('./package.json'),
    streamify = require('gulp-streamify'),
    babel = require('gulp-babel'),
    rename = require('gulp-rename'),
    watch = require('gulp-watch');

var srcDir = './src/';
var outDir = './';

var header = "/*!\n\
 * Chart.CurrentMarker.js\n\
 * http://www.threerabbits.io/opensource/\n\
 * Version: {{ version }}\n\
 *\n\
 * Copyright 2016 Pascal Ehlert\n\
 * Released under the MIT license\n\
 * https://github.com/pehlert/Chart.CurrentMarker.js/blob/master/LICENSE.md\n\
 */\n";

gulp.task('build', buildTask);
gulp.task('watch', function () {
  return watch('src/**/*.js', { ignoreInitial: false }, buildTask);
});

function buildTask() {
  var nonBundled = gulp.src('./src/chart.currentmarker.js')
     .pipe(babel({
       presets: ['es2015']
     }))
    .pipe(insert.prepend(header))
    .pipe(streamify(replace('{{ version }}', package.version)))
    .pipe(rename('Chart.CurrentMarker.js'))
    .pipe(gulp.dest(outDir))
    .pipe(streamify(uglify({
      preserveComments: 'some'
    })))
    .pipe(streamify(concat('Chart.CurrentMarker.min.js')))
    .pipe(gulp.dest(outDir));

  return nonBundled;

}
