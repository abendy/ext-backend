'use strict'

const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const concat = require('gulp-concat')
const del = require('del')
const gulp = require('gulp')
const lint = require('eslint')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')

const src = 'src/'
const dist = 'app/static/'

//////////////////////////////
// Begin Gulp Tasks
//////////////////////////////

function clean(cb) {
    return del([dist + 'js/*.js'], cb)
}

function scripts() {
    return gulp.src([
        'node_modules/rangy/lib/rangy-core.js',
        src + 'js/rangy.js'
    ])
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(dist + 'js/'))
}

function styles() {
    return gulp.src([
        src + 'scss/style.scss'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('main.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(dist + 'css/'))
}

function watch() {
    return gulp.watch(src + 'js/**/*.js', gulp.series(clean, scripts));
    return gulp.watch(src + 'js/**/*.js', gulp.series(clean, styles));
}

const build = gulp.series(clean, scripts, styles)

exports.default = build
exports.build = build
exports.clean = clean
exports.watch = watch;
