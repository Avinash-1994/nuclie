// Stub types for audit module when optional dependencies are not available
export interface AuditResult {
    id: string;
    title: string;
    status: 'PASS' | 'WARN' | 'FAIL';
    score: number;
    details: string;
    fix?: string;
}

export interface AuditGroup {
    name: string;
    results: AuditResult[];
    score: number;
}

export interface AuditContext {
    [key: string]: any;
}

export interface AuditReport {
    timestamp: number;
    groups: {
        a11y?: AuditGroup;
        perf?: AuditGroup;
        seo?: AuditGroup;
        bestPractices?: AuditGroup;
    };
}
