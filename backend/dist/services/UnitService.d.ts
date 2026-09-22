export declare class UnitService {
    static getAll(): {
        units: import("../types").Unit[];
        messages: import("../types").Message[];
        total: number;
    };
    static getById(id: string): import("../types").Unit | undefined;
    static getActive(): import("../types").Unit[];
    static getByZone(zone: string): import("../types").Unit[];
    static updateStatus(id: string, status: 'patrol' | 'responding' | 'standby' | 'staging' | 'offline'): import("../types").Unit | null;
    static sendMessage(from: string, msg: string, priority?: 'critical' | 'high' | 'normal'): import("../types").Message;
    static getMessages(limit?: number): import("../types").Message[];
}
//# sourceMappingURL=UnitService.d.ts.map