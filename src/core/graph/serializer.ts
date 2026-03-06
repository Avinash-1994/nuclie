
export class ShortIdMap {
    private map = new Map<string, string>();
    private counter = 0;

    get(path: string, isProduction: boolean = true): string {
        if (!isProduction) return path;

        if (!this.map.has(path)) {
            this.map.set(path, `n${this.counter++}`);
        }
        return this.map.get(path)!;
    }

    toRuntime(): string {
        return `const __urja_map = ${JSON.stringify(Object.fromEntries(this.map))};`;
    }

    getInverse(shortId: string): string | undefined {
        for (const [key, value] of this.map.entries()) {
            if (value === shortId) return key;
        }
        return undefined;
    }
}
