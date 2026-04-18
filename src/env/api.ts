
/**
 * Sparx Environment API
 * Unified Runtime for Browser, Node, and Edge
 * Day 26: Environment API Lock
 */

export interface EnvConfig {
    mode: 'development' | 'production';
    ssr: boolean;
    base: string;
}

export class SparxEnv {
    private static instance: SparxEnv;
    public config: EnvConfig;
    private listeners: Function[] = [];

    private constructor(config: EnvConfig) {
        this.config = config;
    }

    static init(config: EnvConfig): SparxEnv {
        if (!SparxEnv.instance) {
            SparxEnv.instance = new SparxEnv(config);
        }
        return SparxEnv.instance;
    }

    static get(): SparxEnv {
        if (!SparxEnv.instance) {
            throw new Error('SparxEnv not initialized');
        }
        return SparxEnv.instance;
    }

    /**
     * Unified HMR Listener
     * Works on Browser (WebSocket) or Server (EventBus/ProcessSignal)
     */
    onHMR(callback: (payload: any) => void) {
        this.listeners.push(callback);
    }

    /**
     * Trigger HMR (Called by Dev Server or WebSocket Client)
     */
    triggerHMR(payload: any) {
        this.listeners.forEach(fn => fn(payload));
    }
}
