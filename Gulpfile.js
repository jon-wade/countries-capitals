var gulp = require('gulp');
var connect = require('gulp-connect');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var gulpCSS = require('gulp-cssnano');

gulp.task('default', function(){
    return gutil.log('Gulp is running!');
});

gulp.task('connect', function() {
    connect.server();
});

gulp.task('browserSync', function(){
    browserSync.init({
        server:{
            baseDir: 'app'
        }
    })
});

gulp.task('useref', function(){
    return gulp.src('./app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', gulpCSS()))
        .pipe(gulp.dest('/build'));
});

gulp.task('copy-html-files', function() {
    gulp.src(['./app/**/*.html'], {base: './app'})
        .pipe(gulp.dest('build/'));
});

gulp.task('build', ['copy-html-files', 'useref']);

gulp.task('watch', ['browserSync'], function (){
    //gulp.watch('app/scss/**/*.scss', ['sass']);
    // Other watchers
    gulp.watch('app/**/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    gulp.watch('app/*.css', browserSync.reload);
});


