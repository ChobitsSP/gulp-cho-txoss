const gulp = require('gulp');
const alias = require('./index.js');

const DEF_OPTION = {
  // 必选参数
  SecretId: 'accessKeyId',
  SecretKey: 'accessKeySecret',
  // // 可选参数
  // FileParallelLimit: 3,    // 控制文件上传并发数
  // ChunkParallelLimit: 8,   // 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
  // ChunkSize: 1024 * 1024 * 8,  // 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
  // Proxy: '',
  // Protocol: 'https:',
  ignoreExist: false, // 是否跳过已经存在的文件
  Region: 'oss-cn-beijing',
  Bucket: 'chobits',
  prefix: 'gulp-cho-alioss',
};

gulp.task('test', () => {
  const config = DEF_OPTION;

  return gulp.src('src/**/*.js', { base: 'src' }).pipe(
    alias(config)
  );
});

gulp.task('default', gulp.series("test"));