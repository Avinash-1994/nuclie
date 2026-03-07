
/**
 * Nuclie Environment API
 * Unified Runtime for Browser, Node, and Edge
 * Day 26: Environment API Lock
 */

export interface EnvConfig {
    mode: 'development' | 'production';
    ssr: boolean;
    base: string;
}

export class NuclieEnv {
    private static instance: NuclieEnv;
    public config: EnvConfig;
    private listeners: Function[] = [];

    private constructor(config: EnvConfig) {
        this.config = config;
    }

    static init(config: EnvConfig): NuclieEnv {
        if (!NuclieEnv.instance) {
            NuclieEnv.instance = new NuclieEnv(config);
        }
        return NuclieEnv.instance;
    }

    static get(): NuclieEnv {
        if (!NuclieEnv.instance) {
            throw new Error('NuclieEnv not initialized');
        }
        return NuclieEnv.instance;
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
