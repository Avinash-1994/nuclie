/**
 * @sparx/remote-cache — Phase 4.2
 *
 * Pluggable remote cache providers for Sparx.
 * Beats Turbopack's moat: user brings their own S3 bucket or uses Sparx Cloud.
 *
 * Interface: RemoteCacheProvider { get, put }
 * Providers: S3Provider, SparxCloudProvider
 */

// ─── Core Interface ───────────────────────────────────────────────────────────

export interface RemoteCacheProvider {
    get(key: string): Promise<Buffer | null>;
    put(key: string, data: Buffer): Promise<void>;
    /** Optional: check if key exists without downloading */
    has?(key: string): Promise<boolean>;
    /** Optional: provider name for logging */
    readonly name: string;
}

// ─── S3 Provider ──────────────────────────────────────────────────────────────

export interface S3ProviderOptions {
    bucket: string;
    /** AWS region (default: us-east-1) */
    region?: string;
    /** Object key prefix (default: 'sparx-cache/') */
    prefix?: string;
    /** Custom endpoint for S3-compatible stores (Cloudflare R2, MinIO, etc.) */
    endpoint?: string;
    /** Skip writing — useful in CI read-only mode */
    readOnly?: boolean;
}

export class S3Provider implements RemoteCacheProvider {
    readonly name = 's3';
    private client: any = null;
    private opts: Required<S3ProviderOptions>;

    constructor(options: S3ProviderOptions) {
        this.opts = {
            region: 'us-east-1',
            prefix: 'sparx-cache/',
            endpoint: '',
            readOnly: false,
            ...options,
        };
    }

    private async getClient() {
        if (this.client) return this.client;
        // Lazy-load @aws-sdk/client-s3 — only required if S3 provider is used
        try {
            const { S3Client } = await import('@aws-sdk/client-s3');
            this.client = new S3Client({
                region: this.opts.region,
                ...(this.opts.endpoint ? { endpoint: this.opts.endpoint } : {}),
            });
        } catch {
            throw new Error(
                '[sparx:remote-cache] S3Provider requires @aws-sdk/client-s3. ' +
                'Install it: npm install @aws-sdk/client-s3'
            );
        }
        return this.client;
    }

    private key(cacheKey: string): string {
        return `${this.opts.prefix}${cacheKey}`;
    }

    async get(cacheKey: string): Promise<Buffer | null> {
        try {
            const { GetObjectCommand } = await import('@aws-sdk/client-s3');
            const client = await this.getClient();
            const res = await client.send(new GetObjectCommand({
                Bucket: this.opts.bucket,
                Key: this.key(cacheKey),
            }));
            const chunks: Buffer[] = [];
            for await (const chunk of res.Body) {
                chunks.push(Buffer.from(chunk));
            }
            return Buffer.concat(chunks);
        } catch (e: any) {
            if (e?.name === 'NoSuchKey' || e?.$metadata?.httpStatusCode === 404) {
                return null; // cache miss
            }
            console.warn(`[sparx:remote-cache] S3 get error for ${cacheKey}: ${e.message}`);
            return null;
        }
    }

    async put(cacheKey: string, data: Buffer): Promise<void> {
        if (this.opts.readOnly) return;
        try {
            const { PutObjectCommand } = await import('@aws-sdk/client-s3');
            const client = await this.getClient();
            await client.send(new PutObjectCommand({
                Bucket: this.opts.bucket,
                Key: this.key(cacheKey),
                Body: data,
                ContentType: 'application/octet-stream',
            }));
        } catch (e: any) {
            console.warn(`[sparx:remote-cache] S3 put error for ${cacheKey}: ${e.message}`);
        }
    }

    async has(cacheKey: string): Promise<boolean> {
        try {
            const { HeadObjectCommand } = await import('@aws-sdk/client-s3');
            const client = await this.getClient();
            await client.send(new HeadObjectCommand({
                Bucket: this.opts.bucket,
                Key: this.key(cacheKey),
            }));
            return true;
        } catch {
            return false;
        }
    }
}

// ─── Sparx Cloud Provider ─────────────────────────────────────────────────────

export interface SparxCloudOptions {
    token: string;
    /** Base URL (default: https://cache.sparx.dev) */
    baseUrl?: string;
    readOnly?: boolean;
}

export class SparxCloudProvider implements RemoteCacheProvider {
    readonly name = 'sparx-cloud';
    private opts: Required<SparxCloudOptions>;

    constructor(options: SparxCloudOptions) {
        this.opts = {
            baseUrl: 'https://cache.sparx.dev',
            readOnly: false,
            ...options,
        };
    }

    private url(key: string): string {
        return `${this.opts.baseUrl}/v1/cache/${encodeURIComponent(key)}`;
    }

    private headers(): Record<string, string> {
        return {
            'Authorization': `Bearer ${this.opts.token}`,
            'User-Agent': 'sparx-build/1.0',
        };
    }

    async get(key: string): Promise<Buffer | null> {
        try {
            const res = await fetch(this.url(key), { headers: this.headers() });
            if (res.status === 404) return null;
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return Buffer.from(await res.arrayBuffer());
        } catch (e: any) {
            console.warn(`[sparx:remote-cache] Cloud get error for ${key}: ${e.message}`);
            return null;
        }
    }

    async put(key: string, data: Buffer): Promise<void> {
        if (this.opts.readOnly) return;
        try {
            const res = await fetch(this.url(key), {
                method: 'PUT',
                headers: { ...this.headers(), 'Content-Type': 'application/octet-stream' },
                body: data,
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
        } catch (e: any) {
            console.warn(`[sparx:remote-cache] Cloud put error for ${key}: ${e.message}`);
        }
    }

    async has(key: string): Promise<boolean> {
        try {
            const res = await fetch(this.url(key), {
                method: 'HEAD',
                headers: this.headers(),
            });
            return res.ok;
        } catch {
            return false;
        }
    }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export interface RemoteCacheConfig {
    provider: 's3' | 'sparx-cloud' | false;
    bucket?: string;
    token?: string;
    region?: string;
    endpoint?: string;
    baseUrl?: string;
    readOnly?: boolean;
}

export function createRemoteCache(config: RemoteCacheConfig): RemoteCacheProvider | null {
    if (!config.provider) return null;

    if (config.provider === 's3') {
        if (!config.bucket) {
            throw new Error('[sparx:remote-cache] S3 provider requires `cache.remote.bucket`');
        }
        return new S3Provider({
            bucket: config.bucket,
            region: config.region,
            endpoint: config.endpoint,
            readOnly: config.readOnly,
        });
    }

    if (config.provider === 'sparx-cloud') {
        if (!config.token) {
            throw new Error('[sparx:remote-cache] sparx-cloud provider requires `cache.remote.token`');
        }
        return new SparxCloudProvider({
            token: config.token,
            baseUrl: config.baseUrl,
            readOnly: config.readOnly,
        });
    }

    return null;
}
