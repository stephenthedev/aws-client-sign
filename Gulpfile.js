'use strict';
let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let babel = require('gulp-babel');
let concat = require('gulp-concat');

gulp.task('default', () => {
  return gulp.src('src/aws-client-sign.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('aws-client-sign.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});
