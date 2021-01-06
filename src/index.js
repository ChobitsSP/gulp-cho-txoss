const through = require('through2');
const OSS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
// const path = require('path');

class OssClient {
  /**
   * 
   * @param {MyOptions} option 
   */
  constructor(option) {
    this.client = new OSS(option);
    this.option = option;
  }
  /**
   * 
   * @param {string} ossPath 
   * @param {MyFile} file 
   */
  put(ossPath, file) {
    return new Promise((resolve, reject) => {
      this.client.putObject({
        Bucket: this.option.Bucket,
        Region: this.option.Region,
        Key: ossPath,
        // 格式1. 传入文件内容
        // Body: fs.readFileSync(filepath),
        // 格式2. 传入文件流，必须需要传文件大小
        Body: fs.createReadStream(file.path),
        ContentLength: fs.statSync(file.path).size,
      }, function (err, data) {
        err ? reject(err) : resolve(data);
      });
    });
  }
  /**
   * 
   * @param {string} ossPath 
   */
  head(ossPath) {
    return new Promise((resolve, reject) => {
      this.client.headObject({
        Bucket: this.option.Bucket,
        Region: this.option.Region,
        Key: ossPath,
      }, function (err, data) {
        err ? reject(err) : resolve(data);
      });
    });
  }
}

/**
 *
 * @param {MyFile} file
 * @param {string} prefix
 */
function getFileKey(file, prefix) {
  var str = file.path
    .replace(file.cwd, '')
    .replace(/\\/g, '/')
    .replace(file.base, '')
    .replace(/^\/+/, '');

  return (
    prefix + (!prefix || prefix[prefix.length - 1] === '/' ? '' : '/') + str
  );
}

/**
 * 上传到阿里云oss
 * @param {OssClient} client
 * @param {string} ossPath
 * @param {MyFile} file
 */
async function uploadFile(client, ossPath, file) {
  try {
    await client.head(ossPath);
  } catch (err) {
    if (err.message === 'Object not exists') {
      return client.put(ossPath, file);
    } else {
      throw err;
    }
  }
}

/**
 * 上传到阿里云oss
 * @param {OssClient} client
 * @param {string} ossPath
 * @param {*} file
 * @param {OSS.PutObjectOptions} opts
 */
function uploadFile2(client, ossPath, file, opts) {
  return client.put(ossPath, file, opts);
}

/**
 *
 * @param {MyOptions} option
 * @returns
 */
function main(option) {
  const client = new OssClient(option);

  return through.obj(
    /**
     * 
     * @param {MyFile} file 
     * @param {*} enc 
     * @param {Function} cb 
     */
    function (file, enc, cb) {
      // if (file.isBuffer()) {
      //   var code = file.contents.toString("utf-8");
      //   code = replacePath(code, file.path, baseUrl, paths);
      //   file.contents = Buffer.from(code, 'utf-8');
      // } else if (file.isStream()) {
      //   var code = fs.readFileSync(file.path, "utf8");
      //   code = replacePath(code, file.path, baseUrl, paths);
      //   file.contents = Buffer.from(code, 'utf-8');
      // }

      if (file.isBuffer()) {
        const ossPath = getFileKey(file, option.prefix);
        const uploadFunc = option.ignoreExist ? uploadFile : uploadFile2;

        uploadFunc(client, ossPath, file)
          .then(function () {
            cb(null, file);
          })
          .catch(function (err) {
            console.error('上传失败', err);
            cb(err, null);
          });
      } else if (file.isStream()) {
        // var code = fs.readFileSync(file.path, "utf8");
        // file.contents = Buffer.from(code, 'utf-8');
        cb(null, file);
      } else {
        cb(null, file);
      }
    });
}

module.exports = main;
