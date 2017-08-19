var gulp =         require("gulp");
var less =         require("gulp-less");
var browserSync =  require("browser-sync").create();
var reload =       browserSync.reload; //页面强制刷新
var notify =       require("gulp-notify");  //提示
var concat =       require("gulp-concat");  //合并
var cleancss =     require("gulp-clean-css");  //压缩
var rev =          require("gulp-rev");  //版本控制
var revCollector = require("gulp-rev-collector");  //生成rev-manifest.json
var runSequence =  require("run-sequence"); // 同步处理
var del =          require("del"); //删除
var vinylPaths =   require("vinyl-paths") //管道删除
var base64 =       require("gulp-base64")//图片压缩
var fs =           require("fs") //文件处理模块，node自带，不需要安装
var imagemin =     require("gulp-imagemin") //图片压缩
var spriter =      require("gulp-css-spriter")  //雪碧图
var babel =        require('gulp-babel'); //转换es6 -> es5
var uglify =       require('gulp-uglify') //压缩 js
var rename =       require('gulp-rename') //更改名称
var changed =      require("gulp-changed") //当我们修改了文件，css js 等gulp需要重新编译一遍

//合并js
//es6转 es5
//压缩js
// 重命名 js名称
gulp.task('js',function(){
	gulp.src(['./src/js/a.js','./src/js/b.js'])
		.pipe(concat('index.js'))
		.pipe(gulp.dest('./src/js'))
		
	gulp.src('./src/js/index.js')
		.pipe(babel({
			presets:['es2015']
		}))
		.pipe(uglify())
		.pipe(rename('./index.min.js'))
		.pipe(gulp.dest('./build/js'))
})

gulp.task('css',function(){
	gulp.src('./src/css/*.less')
		.pipe(less())
		.pipe(gulp.dest('./src/css'))
		.pipe(reload({stream:true}))
	
	
	gulp.src(['./src/css/main.css','./src/css/header.css'])
		.pipe(concat('index.css'))
		
//		.pipe(spriter({
//			//已经不常用了，现在都用base64
//			'spriteSheet':'./build/img/spritesheet.png',
//			'pathTospriteSheetFromCss':'../img/spritesheet'
//		}))
		
		.pipe(base64({
			maxImageSize:8*1024,//限制，8kb以下的图片压缩
			debug:true
		}))
		
		.pipe(cleancss())
		.pipe(rev())
		.pipe(gulp.dest('./build/css'))
		
		.pipe(rev.manifest())
		.pipe(gulp.dest('./rev'))
		.pipe(reload({stream:true}))
})

//gulp.task('temp',function(){
//	fs.exists('./rev/rev-manifest.json',function(aaa){
//		console.log(aaa)
//	})
//})

gulp.task('html',function(){
	fs.exists('./rev/rev-manifest.json',function(aaa){
		if(aaa == true){
			gulp.src(['./rev/*.json','./src/*.html'])
				.pipe(revCollector())
				.pipe(gulp.dest('./build'))
				.pipe(reload({stream:true}))
		}else{
			runSequence('html')
		}
	})
})

gulp.task('images',function(){
	gulp.src('./src/img/*.*')
		.pipe(imagemin())
		.pipe(gulp.dest('./build/img'))
})


gulp.task('default',function(){
	runSequence('images','css','js','html')
	browserSync.init({
		server:{
			baseDir:"./build"
		},
		port:8080
	})
	gulp.watch("src/css/*.less",['images','css','html'])
	gulp.watch("src/*.html",['html'])
	gulp.watch('src/js/*.js',['js'])
})


gulp.task('clear',function(){
	del([
		'./build/',
		'./rev/'
	])
})