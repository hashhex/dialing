const { series, parallel, watch, src, dest } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const moduleImporter = require('sass-module-importer');
const twig = require('gulp-twig');
const cmq = require('gulp-group-css-media-queries');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const del = require('del');
const minify = require('gulp-babel-minify');


// true = development , false = production
let mode_dev = true

let webpack_config = {
    output: {
        filename: 'app.js'
    },
    mode: mode_dev ? 'development' : 'production',
    devtool: mode_dev ? 'eval-source-map' : 'none'
}


const browsersync = () => {
	browserSync.init({
		server: { 
            baseDir: 'dist' 
        },
		notify: true
    })
}

function styles() {
    return src('src/scss/**/*.scss')
            .pipe(sass({ importer: moduleImporter() }))
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(cmq())
            .pipe(postcss([
                autoprefixer(),
                cssnano()
            ]))
            .pipe(sourcemaps.write(''))
            .pipe(dest('dist/css'))
            .pipe(browserSync.stream())
}

function template() {
    return src('src/pages/*.html')
        .pipe(twig())
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
}

function scripts() {
    return src('src/js/app.js')
        .pipe(sourcemaps.init())
        .pipe(webpack(webpack_config))
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(minify({
            removeConsole: mode_dev ? false : true,
            removeDebugger: mode_dev ? false : true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream())
}

function copy() {
     return src(['src/fonts/**/*', 'src/assets/**/*', 'src/img/**/*'],{
        base: 'src'
    })
    .pipe(dest('dist'));
}

function cleanImg() {
	return del('dist/assets/img/**/*', { force: true })
}

function startwatch() {
	watch(['src/scss/**/*'], parallel('styles'));
	watch(['src/js/**/*.js'], parallel('scripts'));
	watch(['src/pages/*.pug', 'src/pages/**/*.html'], parallel('template'));
	watch(['src/assets/**/*'], parallel('copy'));
}


exports.styles  = styles;
exports.template  = template;
exports.scripts  = scripts;
exports.copy  = copy;
exports.assets = series(cleanImg, copy)
exports.default = parallel( styles, template , scripts, browsersync,startwatch, [this.assets]);