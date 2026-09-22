import { Alert } from '../types';
export declare class AlertModel {
    static getAll(): Alert[];
    static getById(id: string): Alert | undefined;
    static getActive(): Alert[];
    static getByPriority(priority: Alert['priority']): Alert[];
    static updateStatus(id: string, status: Alert['status']): Alert | null;
}
//# sourceMappingURL=Alert.d.ts.map