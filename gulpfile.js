'use strict'

const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const concat = require('gulp-concat')
const del = require('del')
const gulp = require('gulp')
const lint = require('eslint')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')

const src = 'src/'
const dist = 'app/static/dist/'

//////////////////////////////
// Begin Gulp Tasks
//////////////////////////////

const clean = (cb) => {
    return del([dist + 'js/*.js', dist + 'css/*.css'], cb)
}

const scripts = () => {
    return gulp.src([src + 'js/main.js'])
    //compile
    .pipe(concat('main.js'))
    .pipe(gulp.dest(dist + 'js/'))
    //minify
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(dist + 'js/'))
}

const styles = () => {
    return gulp.src([
        src + 'scss/style.scss'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    //compile
    .pipe(concat('main.css'))
    .pipe(gulp.dest(dist + 'css/'))
    //minify
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(concat('main.min.css'))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(dist + 'css/'))
}

const watch = () => {
    gulp.watch(src + 'js/**/*.js', scripts)
    gulp.watch(src + 'scss/**/*.scss', styles)
}

const build = gulp.series(clean, scripts, styles)

module.exports = {
    default: build,
    build,
    clean,
    scripts,
    styles,
    watch
}
