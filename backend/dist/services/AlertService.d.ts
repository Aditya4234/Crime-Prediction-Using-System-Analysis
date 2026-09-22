export declare class AlertService {
    static getAll(): import("../types").Alert[];
    static getById(id: string): import("../types").Alert | undefined;
    static getActive(): import("../types").Alert[];
    static getByPriority(priority: 'critical' | 'high' | 'medium' | 'low'): import("../types").Alert[];
    static updateStatus(id: string, status: 'responding' | 'contained' | 'resolved'): import("../types").Alert | null;
}
//# sourceMappingURL=AlertService.d.ts.map