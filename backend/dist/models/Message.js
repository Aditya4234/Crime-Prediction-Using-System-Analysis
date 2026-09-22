"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const database_1 = require("../lib/database");
class MessageModel {
    static getAll() {
        return (0, database_1.getCollection)('messages');
    }
    static getById(id) {
        const messages = this.getAll();
        return messages.find(msg => msg.id === id);
    }
    static getRecent(limit = 10) {
        const messages = this.getAll();
        return messages.slice(-limit);
    }
    static create(from, msg, priority = 'normal') {
        const messages = this.getAll();
        const now = new Date();
        const newMessage = {
            id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
            from,
            msg,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
            priority,
        };
        messages.push(newMessage);
        (0, database_1.updateCollection)('messages', messages);
        return newMessage;
    }
    static delete(id) {
        const messages = this.getAll();
        const filtered = messages.filter(msg => msg.id !== id);
        if (filtered.length === messages.length)
            return false;
        (0, database_1.updateCollection)('messages', filtered);
        return true;
    }
}
exports.MessageModel = MessageModel;
//# sourceMappingURL=Message.js.map