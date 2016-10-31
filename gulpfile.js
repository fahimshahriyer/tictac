var gulp            = require('gulp');
var gutil           = require('gulp-util');
var browserSync     = require('browser-sync');

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

// BrowserSync Configuration
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "./"
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
});

//Keeping an eye on all HTML files
gulp.task('html', function() {
    //watch any and all HTML files and refresh when something changes
    return gulp.src('*.html')

        .pipe(browserSync.reload({stream: true}))
        //catch errors
        .on('error', gutil.log);
});

// Default Task
gulp.task('default', ['browserSync'], function(){
    gulp.watch('*.html', ['html']);
    gulp.watch('styles/*.css', ['html']);
    gulp.watch('javascript/*.js',['html']);
});