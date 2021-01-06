# gulp-cho-alioss
https://www.npmjs.com/package/ali-oss

## Usage

```shell
npm install --save-dev gulp-cho-alioss
```

Then, add it to your `gulpfile.js`:

### Simple
```javascript
var alias = require('gulp-cho-alioss');

gulp.task('test', () => {
  return gulp.src('dist/**/*', { base: 'dist' })
    .pipe(alias({
      region: 'oss-cn-beijing',
      accessKeyId: 'accessKeyId',
      accessKeySecret: 'accessKeySecret',
      bucket: 'chobits',
      prefix: 'gulp-cho-alioss',
      ignoreExist: false,
      putOptions: {}
    }));
});
```
