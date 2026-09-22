interface Database {
    users: any[];
    incidents: any[];
    alerts: any[];
    units: any[];
    messages: any[];
    stats: any;
}
export declare function readDb(): Database;
export declare function writeDb(data: Database): void;
export declare function getCollection<K extends keyof Database>(collection: K): Database[K];
export declare function updateCollection<K extends keyof Database>(collection: K, data: Database[K]): void;
export {};
//# sourceMappingURL=database.d.ts.map