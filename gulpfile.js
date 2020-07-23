const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
 
function Task(){
  return gulp.src('dist/**/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('dist'));
}

exports.default = Task