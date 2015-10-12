var gulp = require('gulp');
var ts = require('gulp-typescript');
var mocha = require('gulp-mocha');

gulp.task('default', function() {
    return gulp.src(['src/**/*.ts', 'test/**/*.ts', 'typings/tsd.d.ts'])
        .pipe(ts(ts.createProject('tsconfig.json')))
        .pipe(gulp.dest('build/'))
});

gulp.task('test', ['default'], function() {
    return gulp.src('build/test.js', {read: false})
        .pipe(mocha());
});
