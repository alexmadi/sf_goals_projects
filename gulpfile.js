'use strict';

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------
var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    rigger      = require('gulp-rigger'),
    connect     = require('gulp-connect'),
    livereload  = require('gulp-livereload'),
    open        = require('gulp-open'),
    imagemin    = require('gulp-imagemin'),
    spritesmith = require('gulp.spritesmith');
// var autoprefixer = require('gulp-autoprefixer');

// -----------------------------------------------------------------------------
// Configuration / settings 
// -----------------------------------------------------------------------------
var input = 'src/scss/**/*.scss';
var output = 'production/css';
var input_html = './production/*.html';

var options = {
    sass: {
        outputStyle: 'extended'
    }
};

// -----------------------------------------------------------------------------
// BUILDING
// -----------------------------------------------------------------------------

    var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'production/',
        css: 'production/css/',
        img: 'production/img/',
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html  
        style: 'src/scss/style.scss',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов

    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
    },
    clean: './production'
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
       // .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('build', [
    'html:build',  
]);

// -----------------------------------------------------------------------------
// Server connect
// -----------------------------------------------------------------------------

gulp.task('connect', function() {
    connect.server({
        root: './production/',
        port: 8888,
        //https: true,
        //livereload: true
    });
    
});

// -----------------------------------------------------------------------------
// Sass compilation
// -----------------------------------------------------------------------------
gulp.task('sass', function () {
    return gulp.src(input)
        .pipe(sourcemaps.init())
        .pipe(sass(options.sass).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(output));
});

gulp.task('html', function () {
    return gulp.src(input)
        .pipe(livereload());
});


// -----------------------------------------------------------------------------
// IMG Compressing
// -----------------------------------------------------------------------------

gulp.task('image', function () {
    return gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('production/img'))
});

// -----------------------------------------------------------------------------
// Sprites
// -----------------------------------------------------------------------------

gulp.task('sprite', function() {
    var spriteData =
        gulp.src('./src/img/sprite/*.*') // source path of the sprite images
            .pipe(spritesmith({
                imgName: '../img/sprite.png',
                cssName: '_sprites.scss',
                cssFormat: 'scss',
                padding: 0,
                algorithm: 'top-down',
            }));

    spriteData.img.pipe(gulp.dest('./src/img/')); // output path for the sprite
    spriteData.css.pipe(gulp.dest('./src/scss/')); // output path for the CSS
});


// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------
gulp.task('watch', function() {

    gulp.watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });

    livereload.listen();
    gulp.watch(input, ['sass']).on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    gulp.watch(input_html, ['sass']);
    // sets up a livereload that watches for any changes in the root
    //gulp.watch(input_html).on('change', function(event) {
    //    livereload();
    //});
    gulp.src('')
    .pipe(open({app: 'chrome', uri: 'http://localhost:8888'}));
});

gulp.task('default', ['html:build', 'connect', 'sass', 'watch']);
