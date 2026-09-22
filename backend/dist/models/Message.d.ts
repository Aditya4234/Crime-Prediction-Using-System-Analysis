import { Message } from '../types';
export declare class MessageModel {
    static getAll(): Message[];
    static getById(id: number): Message | undefined;
    static getRecent(limit?: number): Message[];
    static create(from: string, msg: string, priority?: Message['priority']): Message;
    static delete(id: number): boolean;
}
//# sourceMappingURL=Message.d.ts.map