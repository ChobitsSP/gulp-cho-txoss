interface MyOptions {
  SecretId: string;
  SecretKey: string;

  /**
   * 控制文件上传并发数
   */
  FileParallelLimit?: number;

  /**
   * 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
   */
  ChunkParallelLimit?: number;

  /**
   * 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
   */
  ChunkSize?: number;
  Proxy?: string;
  Protocol?: string;

  /**
   * 是否跳过已经存在的文件
   */
  ignoreExist?: boolean;

  Region: string;
  Bucket: string;
  prefix?: string;
}

interface MyFile {
  path: string;
  cwd: string;
  base: string;
  isBuffer(): boolean;
  isStream(): boolean;
}