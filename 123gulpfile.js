var gulp = require("gulp");
var less = require("gulp-less");
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;
var notify = require("gulp-notify");
var concat = require("gulp-concat");
var cleancss = require("gulp-clean-css");
var rev = require("gulp-rev");
var revCollector = require("gulp-rev-collector");
var runSequence = require("run-sequence");

gulp.task('less',function(){
	gulp.src('./src/css/*.less')
		.pipe(less())
		.pipe(gulp.dest('./src/css'))
		.pipe(reload({stream:true}))
})
gulp.task('concat',function(){
	gulp.src(['./src/css/main.css','./src/css/header.css'])
		.pipe(concat('index.css'))
		
		.pipe(cleancss())
		.pipe(rev())
		.pipe(gulp.dest('./build/css'))
		
		.pipe(rev.manifest())
		.pipe(gulp.dest('./rev'))
		.pipe(reload({stream:true}))
})
gulp.task('html',function(){
	gulp.src(['./rev/*.json','./src/*.html'])
		.pipe(revCollector())
		.pipe(gulp.dest('./build/'))
		.pipe(reload({stream:true}))
})

gulp.task('images',function(){
	gulp.src('./src/img/*.*')
		.pipe(gulp.dest('./build/img'))
})


gulp.task('default',function(){
	runSequence(['images','less'],'concat','html')
	browserSync.init({
		server:{
			baseDir:"./build/"
		},
		port:8080
	});
	gulp.watch("./src/css/*.less",['less','concat'])
	gulp.watch("./src/*.html",['html'])
})
