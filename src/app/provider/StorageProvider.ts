import { getRequestContext } from '@cloudflare/next-on-pages'
import R2StorageProvider from '@/app/provider/R2StorageProvider';
import TelegraphStorageProvider from '@/app/provider/TelegraphStorageProvider';
import SignProxyProvider from "@/app/provider/SignProxyProvider";

export type StorageProviderType = 'r2' | 'telegraph';
export type FileKey = {
    path: string,
    query?: URLSearchParams
}
export interface StorageProvider {
    save(file: ReadableStream | Blob, filename: string): Promise<FileKey>;
    load(key: FileKey): Promise<ReadableStream | Blob | null>;
}

export function getStorageProvider(): StorageProvider {
    const providerCfg = getRequestContext().env.STORAGE_PROVIDER || 'telegraph';
    if(providerCfg === 'r2') {
        const bucket = getRequestContext().env.R2_BUCKET;
        return new R2StorageProvider(bucket);
    }

    if(providerCfg === 'telegraph') {
        const enableSign = getRequestContext().env.TELEGRAPH_SIGN_ENABLED === 'true';
        if(enableSign) {
            const secret = getRequestContext().env.SECRET_KEY;
            if(!secret) {
                throw new Error("ENV SECRET_KEY is required");
            }
            return new SignProxyProvider(secret, new TelegraphStorageProvider());
        } else {
            return new TelegraphStorageProvider();
        }
    }
    throw new Error(`Unknown storage provider: ${providerCfg}`);
}