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
const dist = 'app/static/dist/'

//////////////////////////////
// Begin Gulp Tasks
//////////////////////////////

const clean = (cb) => {
    return del([dist + 'js/*.js', dist + 'css/*.css'], cb)
}

const scripts = () => {
    return gulp.src([
        'node_modules/rangy/lib/rangy-core.js',
        'node_modules/rangy/lib/rangy-serializer.js',
        src + 'js/rangy.js'
    ])
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(dist + 'js/'))
}

const styles = () => {
    return gulp.src([
        src + 'scss/style.scss'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('main.css'))
    .pipe(cleanCSS())
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
