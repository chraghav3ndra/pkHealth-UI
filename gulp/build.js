'use strict';

var path = require('path');
var gulp = require('gulp');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var deployer = require('nexus-deployer');
var conf = require('./conf');

var currentTime = null;

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});



gulp.task('partials', function() {
    return gulp.src([
            path.join(conf.paths.src, '/app/**/*.html'),
            path.join(conf.paths.tmp, '/serve/app/**/*.html')
        ])
        .pipe($.htmlmin({
            removeEmptyAttributes: true,
            removeAttributeQuotes: true,
            collapseBooleanAttributes: true,
            collapseWhitespace: true
        }))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'pkHealth',
            root: 'app'
        }))
        .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function() {
    var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), {
        read: false
    });
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: path.join(conf.paths.tmp, '/partials'),
        addRootSlash: false
    };

    var htmlFilter = $.filter('*.html', {
        restore: true
    });
    var jsFilter = $.filter('**/*.js', {
        restore: true
    });
    var cssFilter = $.filter('**/*.css', {
        restore: true
    });

    return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe($.useref())
        .pipe(jsFilter)
        .pipe($.sourcemaps.init())
        .pipe($.ngAnnotate())
        .pipe($.uglify({
            preserveComments: $.uglifySaveLicense
        }))
        .on('error', conf.errorHandler('Uglify'))
        .pipe($.rev())
        .pipe($.sourcemaps.write('maps'))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        // .pipe($.sourcemaps.init())
        .pipe($.cssnano())
        .pipe($.rev())
        // .pipe($.sourcemaps.write('maps'))
        .pipe(cssFilter.restore)
        .pipe($.revReplace())
        .pipe(htmlFilter)
        .pipe($.htmlmin({
            removeEmptyAttributes: true,
            removeAttributeQuotes: true,
            collapseBooleanAttributes: true,
            collapseWhitespace: true
        }))
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.size({
            title: path.join(conf.paths.dist, '/'),
            showFiles: true
        }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function() {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,otf,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('customfonts', function() {
    return gulp.src([path.join(conf.paths.src, '/assets/fonts/**/*')])
        .pipe($.filter('**/*.{eot,otf,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('other', function() {
    var fileFilter = $.filter(function(file) {
        return file.stat.isFile();
    });

    return gulp.src([
            path.join(conf.paths.src, '/**/*'),
            path.join('!' + conf.paths.src, '/**/*.{html,css,js}')
        ])
        .pipe(fileFilter)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', function() {
    // Clear Dist Directory content
    return $.del.sync([conf.paths.dist + '/**', conf.paths.artifact + '/**']);
});

gulp.task('buildArtifact', function() {
    // Create Artifact directory
    return gulp.src('./')
        .pipe(gulp.dest(path.join(conf.paths.artifact, '/')));
});

gulp.task('build', ['clean', 'html', 'fonts', 'customfonts', 'other']);

gulp.task("package", ['build', 'buildArtifact'], function() {
    currentTime = ""; //new Date().getTime();
    // Copy Archived UI Deployable Unit in Artifact Directory
    return gulp.src([path.join(conf.paths.dist, '/**/*')])
        .pipe(tar('edp-ui-setup' + currentTime + '.tar'))
        .pipe(gzip())
        .pipe(gulp.dest(conf.paths.artifact));

});

gulp.task("install", ['package'], function(callback) {

    var snapshot = {
        groupId: 'edp-ui',
        artifactId: 'edp-ui-setup',
        version: '1.1-SNAPSHOT',
        packaging: 'tar.gz',
        auth: {
            username: 'admin',
            password: 'pknxadmin@123'
        },
        pomDir: 'dist/pom',
        url: 'https://nexusci.prokarmalabs.com/repository/edp-ui-snapshots',
        artifact: 'artifact/edp-ui-setup' + currentTime + '.tar.gz',
        cwd: '',
        noproxy: 'localhost',
        quiet: false,
        insecure: true
    };

    var release = {
        groupId: 'edp-ui',
        artifactId: 'edp-ui-setup',
        version: '1.2-SNAPSHOT',
        packaging: 'tar.gz',
        auth: {
            username: 'admin',
            password: 'pknxadmin@123'
        },
        pomDir: 'dist/pom',
        url: 'https://nexusci.prokarmalabs.com/repository/edp-ui-releases',
        artifact: 'artifact/edp-ui-setup' + currentTime + '.tar.gz',
        cwd: '',
        noproxy: 'localhost',
        quiet: false,
        insecure: true
    };


    deployer.deploy(snapshot, callback);
    //deployer.deploy(release, callback);
});
