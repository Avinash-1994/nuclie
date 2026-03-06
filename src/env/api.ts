
/**
 * Urja Environment API
 * Unified Runtime for Browser, Node, and Edge
 * Day 26: Environment API Lock
 */

export interface EnvConfig {
    mode: 'development' | 'production';
    ssr: boolean;
    base: string;
}

export class UrjaEnv {
    private static instance: UrjaEnv;
    public config: EnvConfig;
    private listeners: Function[] = [];

    private constructor(config: EnvConfig) {
        this.config = config;
    }

    static init(config: EnvConfig): UrjaEnv {
        if (!UrjaEnv.instance) {
            UrjaEnv.instance = new UrjaEnv(config);
        }
        return UrjaEnv.instance;
    }

    static get(): UrjaEnv {
        if (!UrjaEnv.instance) {
            throw new Error('UrjaEnv not initialized');
        }
        return UrjaEnv.instance;
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
