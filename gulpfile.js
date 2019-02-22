'use strict';

const concat = require('gulp-concat')
const del = require('del')
const gulp = require('gulp')
const lint = require('eslint')
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
        'node_modules/rangy/lib/rangy-classapplier.js',
        'node_modules/rangy/lib/rangy-highlighter.js',
        src + 'js/rangy.js'
    ])
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(dist + 'js/'))
}

function watch() {
    return gulp.watch(src + 'js/**/*.js', gulp.series(clean, scripts));
}

const build = gulp.series(clean, scripts)

exports.default = build
exports.build = build
exports.clean = clean
exports.watch = watch;
