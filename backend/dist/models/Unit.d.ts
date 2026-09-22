import { Unit } from '../types';
export declare class UnitModel {
    static getAll(): Unit[];
    static getById(id: string): Unit | undefined;
    static getActive(): Unit[];
    static getByZone(zone: string): Unit[];
    static updateStatus(id: string, status: Unit['status']): Unit | null;
    static updateBattery(id: string, battery: number): Unit | null;
}
//# sourceMappingURL=Unit.d.ts.map