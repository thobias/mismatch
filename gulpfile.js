var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    jshint = require('gulp-jshint');


gulp.task('server', function() {
  gulp.src('app')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      port: 8080
    }));
});

gulp.task('lint', function() {
  return gulp.src(['app/scripts/*.js', 'app/scripts/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
})