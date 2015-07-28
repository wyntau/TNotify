var gulp = require('gulp')
  , minifyCss = require('gulp-minify-css')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename')

gulp.task('cssmin', function(){
  gulp
    .src('tnotify.css')
    .pipe(minifyCss({
      advanced: false,
      keepSpecialComments: 1
    }))
    .pipe(rename('tnotify.min.css'))
    .pipe(gulp.dest('.'))
});

gulp.task('jsmin', function(){
  gulp
    .src('tnotify.js')
    .pipe(uglify({
      mangle: {
        except: ['angular']
      },
      preserveComments: 'some'
    }))
    .pipe(rename('tnotify.min.js'))
    .pipe(gulp.dest('.'))
});

gulp.task('default', ['cssmin', 'jsmin']);
