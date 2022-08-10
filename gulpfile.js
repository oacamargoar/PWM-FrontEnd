const { src, dest, watch, parallel } = require("gulp");

const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber')
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//Rutas
const rutas = {
    scss: './src/scss/**/*.scss',
    js: './src/js/**/*.js',
    css: './build/css',
    imgSrc: './src/img/**/*.{png,jpg}',
    imgBuil: './build/img'
}

function css( done ) {
    src(rutas.scss)
        .pipe( sourcemaps.init() )
        .pipe( plumber() )
        .pipe( sass() )
        .pipe( postcss([autoprefixer(), cssnano()]) )
        .pipe( sourcemaps.write('.'))
        .pipe( dest( rutas.css ))
    done();
}
function imagenes( done ) {
    const opciones = {
        optimizationLevel: 3
    }
    src(rutas.imgSrc)
        .pipe( cache( imagemin( opciones ) ) )
        .pipe( dest( rutas.imgBuil ) )
    done();
}

function versionWebp( done ) {
    const opciones = {
        quality: 50
    }
    src(rutas.imgSrc)
        .pipe( webp( opciones ) )
        .pipe( dest( rutas.imgBuil ) )
    done();
}

function versionAvif( done ) {
    const opciones = {
        quality: 50
    }
    src(rutas.imgSrc)
        .pipe( avif( opciones ) )
        .pipe( dest( rutas.imgBuil ) )
    done();
}

function js( done ) {
    src( rutas.js )
        .pipe( dest('./build/js') )
    done();
}

function dev( done ) {
    watch(rutas.scss, css);
    watch(rutas.js, js);
    done();
}

exports.css = css;
exports.js = js;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel( imagenes, versionWebp, versionAvif, js, dev );