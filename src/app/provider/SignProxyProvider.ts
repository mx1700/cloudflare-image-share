import {FileKey, StorageProvider} from "@/app/provider/StorageProvider";

export default class SignProxyProvider implements StorageProvider {
    private readonly provider: StorageProvider;
    private readonly secret: string;
    constructor(secret: string, provider: StorageProvider) {
        this.provider = provider;
        this.secret = secret;
    }

    async load(key: FileKey): Promise<ReadableStream | Blob | null> {
        const pass = await this.checkSign(key);
        if(!pass) {
            return null;
        }
        return await this.provider.load(key);
    }

    async save(file: ReadableStream | Blob, filename: string): Promise<FileKey> {
        const key = await this.provider.save(file, filename);
        return await this.signing(key)
    }

    async checkSign(key: FileKey): Promise<boolean> {
        const sign = await this.getSign(key.path);
        const s = key.query?.get('s');
        return s === sign;
    }

    async signing(key: FileKey): Promise<FileKey> {
        const sign = await this.getSign(key.path);
        const query = new URLSearchParams(key.query?.toString());
        query.set('s', sign);
        return { path: key.path, query: query };
    }

    async getSign(key: string): Promise<string> {
        const data = new TextEncoder().encode(key + this.secret);
        const myDigest = await crypto.subtle.digest(
            {
                name: 'SHA-256',
            },
            data
        );

        return Array.from(new Uint8Array(myDigest))
            .map(b => b.toString(16).padStart(2, '0'))
            .splice(0, 3)
            .join('');
    }
}