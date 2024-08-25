import {FileKey, StorageProvider} from '@/app/provider/StorageProvider';
import { generateRandomString, getFileExtension } from '@/app/util';

export default class R2StorageProvider implements StorageProvider {
  private bucket: R2Bucket;
  constructor(bucket: R2Bucket) {
    this.bucket = bucket;
  }
  async load(key: FileKey): Promise<ReadableStream | Blob | null> {
    const obj = await this.bucket.get(key.path)
    if (!obj) {
      return null;
    }
    return obj.body;
  }

  async save(file: ReadableStream | Blob, filename: string): Promise<FileKey> {
    const extension = getFileExtension(filename)
    const key = generateRandomString(12) + '.' + extension;
    const customMetadata = { "x-amz-meta-filename": filename };
    await this.bucket.put(key, file, { customMetadata });
    return { path: key };
  }
}
