var gulp = require('gulp');
//gulp.task('default', function() {
	// place code for your default task here
//});

//less 组件，需要安装 npm install glup-less
var less = require('gulp-less');
//gulp.task('less',function(){
//	gulp.src('./src/css/main.less')
//		.pipe(less())
//		.pipe(gulp.dest('./build/css'))
//		.pipe(reload({stream:true}))
//})



//服务器组件,需要安装 npm install browser-sync
var browserSync = require('browser-sync').create();
// 静态服务器
//gulp.task('server', function() {
//  browserSync.init({
//      server: {
//          baseDir: "./"
//      },
//      port:8080
//  });
//});


//代理服务器  让别人去做服务，我们只是桥
//gulp.task('dl',function(){
//	browserSync.init({
//		proxy:'192.168.1.7',
//		port:'9090'
//	})
//})


// 任务提醒模块 glup-notify , 需要安装 npm install glup-notify
// 引入
var notify = require("gulp-notify");
gulp.task('less',function(){
	gulp.src('./src/css/*.less')
		.pipe(less())
		.pipe(gulp.dest('./src/css'))
		.pipe(reload({stream:true}))
//		.pipe(notify("编译 less -> css [<%= file.relative %>]"))
})


//css的合并，需要更改输出路径
//引入  安装 npm install gulp-concat --save-dev
var concat = require("gulp-concat");
//gulp.task('concat',function(){
//	gulp.src(['./src/css/main.css','./src/css/header.css'])
//		.pipe(concat('index.css'))
//		.pipe(gulp.dest('./build/css'))
//		.pipe(reload({stream:true}))
//		.pipe(notify("合并 css -> css [<%= file.relative %>]"))
//})

//转换图片路径从 src文件夹下，到build文件夹下
gulp.task('images',function(){
	gulp.src('./src/img/*.*')
		.pipe(gulp.dest('./build/img'))
})


//css压缩
var cleancss = require("gulp-clean-css"); 
//gulp.task('concat',function(){
//	gulp.src(['./src/css/main.css','./src/css/header.css'])
//		.pipe(concat('index.css'))
//		.pipe(cleancss())  //css压缩
//		.pipe(gulp.dest('./build/css'))
//		.pipe(reload({stream:true}))
//		.pipe(notify("合并 css -> css [<%= file.relative %>]"))
//})

//查看压缩前文件和压缩后文件大小
//gulp.task('concat',function(){
//	gulp.src(['./src/css/main.css','./src/css/header.css'])
//		.pipe(concat('index.css'))
//		.pipe(cleancss({debug:true},function(dateils){
//			console.log(dateils.name + ':' +dateils.stats.originalSize);
//			console.log(dateils.name + ':' +dateils.stats.minifiedSize);
//		}))  //css压缩
//		.pipe(gulp.dest('./build/css'))
//		.pipe(reload({stream:true}))
//		.pipe(notify("合并 css -> css [<%= file.relative %>]"))
//})


//版本控制 控制缓存,生成随机字符串，生成一个json文件
//在 css压缩这个步骤里加入  版本控制 的流！
var rev = require("gulp-rev")

//图片的base64压缩
var base64 = require("gulp-base64")


gulp.task('concat',function(){
	gulp.src(['./src/css/main.css','./src/css/header.css'])
		.pipe(concat('index.css'))
		
		//.pipe(base64())  //base64 图片压缩
		.pipe(base64({
			maxImageSize:8*1024  //限制，8kb以下的图片压缩
		}))
		
		
		
		.pipe(cleancss())  //css压缩
		.pipe(rev())  //版本控制
		.pipe(gulp.dest('./build/css'))
		
		.pipe(rev.manifest())  //输出数据集,生成一个rev-mainsest.json 的文件
		.pipe(gulp.dest('./rev')) //生成的json文件 输入到 rev 文件夹内
		
		.pipe(reload({stream:true}))
//		.pipe(notify("合并 css -> css [<%= file.relative %>]"))
})

//路径修改器

var revCollector = require("gulp-rev-collector");
gulp.task('html',function(){
	gulp.src(['./rev/*.json','./src/*.html'])
		.pipe(revCollector())
		.pipe(gulp.dest('./build/'))
		.pipe(reload({stream:true}))
})


//移动html 到build目录下    多余的
//gulp.task('html',function(){
//	gulp.src('./src/*.html')
//		.pipe(gulp.dest('./build/'))
//})


//删除插件 del,数组的形式传参,传入要删除的文件夹
//var del = require("del");
//gulp.task('del',function(){
//	del([
//		'./build/'
//	])
//})

// 通过命名的方式，这样就可以区别命令删除不同的文件夹
var del = require("del");
gulp.task('del:build',function(){
	del([
		'./build/'
	])
})



//自动刷新页面 gulp.watch
var reload = browserSync.reload;
//修改启动路径 baseDir:"./build/"
//加入同步、异步处理runSequence
//同步\异步的插件
var runSequence = require("run-sequence");



var vinylPaths = require("vinyl-paths") //管道删除


gulp.task('default',function() {
//测试用，管道内删除,每次运行都先删除 rev文件夹，在生成一个
//	//测试管道内删除
//	gulp.src('./rev')
//		.pipe(vinylPaths(del))
//		.pipe(notify("执行管道内删除"))
	
    runSequence(['images','less'],'concat','html')
    browserSync.init({
        server: {
        	baseDir:"./build/"
        },
        port:8080
    });
    gulp.watch("src/css/*.less",['images','less','concat']);
    gulp.watch("src/*.html",['html']);
});
