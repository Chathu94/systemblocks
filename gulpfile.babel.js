import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';
import runSequence from 'run-sequence';

const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**', 'config.js'],
  nonJs: ['./package.json', './.gitignore', './README.md'],
};

const plugins = gulpLoadPlugins();

gulp.task('clean', () => del(['dist/**', '!dist', 'build/**', '!build']));

gulp.task('copy', () =>
  gulp.src(paths.nonJs)
    .pipe(plugins.newer('dist'))
    .pipe(gulp.dest('dist'))
);

gulp.task('babel', () =>
  gulp.src([...paths.js, '!gulpfile.babel.js'], { base: '.' })
    .pipe(plugins.newer('dist'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.', {
      includeContent: false,
      sourceRoot(file) {
        return path.relative(file.path, __dirname);
      }
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('nodemon', ['copy', 'babel'], () =>
  plugins.nodemon({
    script: path.join('dist', 'example', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['clean', 'copy', 'babel']
  })
);

gulp.task('dev', ['clean'], () => runSequence('nodemon'));
