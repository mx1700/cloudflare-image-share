import {FileKey, StorageProvider} from '@/app/provider/StorageProvider';

const DEFAULT_PREFIX = '/file/';
export default class TelegraphStorageProvider implements StorageProvider {

  async load(key: FileKey): Promise<ReadableStream | Blob | null> {
    const src = this.keyToSrc(key.path);
    const r = await fetch(`https://telegra.ph${src}`);
    return r.body as ReadableStream;
  }

  async save(file: ReadableStream | Blob, filename: string): Promise<FileKey> {
    const tgFormData = new FormData();
    tgFormData.append('file', file as Blob);
    const r = await fetch('https://telegra.ph/upload', {
      method: 'POST',
      body: tgFormData,
    });
    const body = await r.json<({ src: string }[]) | { error: string }>();
    if(Array.isArray(body)) {
      const path = this.srcToKey(body[0].src);
      return { path }
    }
    throw new Error(body.error);
  }

  srcToKey(src: string) {
    if(src.startsWith(DEFAULT_PREFIX)) {
      return src.substring(DEFAULT_PREFIX.length);
    } else {
      throw new Error('Invalid telegra.ph src');
    }
  }

  keyToSrc(key: string) {
    return `${DEFAULT_PREFIX}${key}`;
  }
}