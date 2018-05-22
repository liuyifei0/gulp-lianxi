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
//glup.task('default',function(){
//	
//})

//less 编译成css 到src/css 文件夹下
gulp.task('less',function(){
	gulp.src('./src/css/*.less')
		.pipe(less())
		.pipe(gulp.dest('./src/css'))
		.pipe(reload({stream:true}))
//		.pipe(notify("编译 less -> css[<%= file.relative %>]"))
})
//合并css，把编译好的css 压缩成一个 index.css
//加入压缩css, cleancss()
//加入版本控制rev()
//输出rev-mainfest.json文件,rev.manifest()
//输出到rev文件夹
gulp.task('concat',function(){
	gulp.src(['./src/css/main.css','./src/css/header.css'])
		.pipe(concat('index.css'))
		.pipe(cleancss())
		.pipe(rev())
		.pipe(gulp.dest('./build/css'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('./rev'))
		.pipe(reload({stream:true}))
//		.pipe(notify("合并css -> bulid/css [<%= file.relative %>]"))
})
//路径修改模块
//gulp.task('html',function(){
//	gulp.src(['./rev/*.json','./src/*.html'])
//		.pipe(revCollector())
//		.pipe(gulp.dest('./build/'))
//		.pipe(reload({stream:true}))
//})	
//移动html到build目录下
//gulp.task('html',function(){
//	gulp.src('./src/*.html')
//		.pipe(gulp.dest('./build/'))
//})
//图片路径转换
gulp.task('images',function(){
	gulp.src('./src/img/*.*')
		.pipe(gulp.dest('./build/img'))
		.pipe(reload({stream:true}))
})
//服务器，监控，各项动作
//修改启动路径
gulp.task('default',function(){
	runSequence(['images','less'],'concat','html')
	browserSync.init({
		server:{
			baseDir:"./build/"
		},
		port:9000
	});
	gulp.watch("./src/css/*.less",['less','images','concat'])
	gulp.watch("src/*.html",['html']);
})