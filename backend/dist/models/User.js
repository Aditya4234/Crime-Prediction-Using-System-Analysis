"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcryptjs_1 = require("bcryptjs");
const uuid_1 = require("uuid");
const database_1 = require("../lib/database");
class UserModel {
    static getAll() {
        return (0, database_1.getCollection)('users');
    }
    static getById(id) {
        return this.getAll().find(u => u.id === id);
    }
    static getByUsername(username) {
        return this.getAll().find(u => u.username === username);
    }
    static getByEmail(email) {
        return this.getAll().find(u => u.email === email);
    }
    static create(input) {
        const users = this.getAll();
        const now = new Date().toISOString();
        const newUser = {
            id: (0, uuid_1.v4)(),
            username: input.username,
            email: input.email,
            password: (0, bcryptjs_1.hashSync)(input.password, 10),
            fullName: input.fullName,
            badge: input.badge,
            role: input.role || 'officer',
            createdAt: now,
            updatedAt: now,
        };
        users.push(newUser);
        (0, database_1.updateCollection)('users', users);
        return newUser;
    }
    static update(id, data) {
        const users = this.getAll();
        const index = users.findIndex(u => u.id === id);
        if (index === -1)
            return null;
        users[index] = {
            ...users[index],
            ...data,
            id: users[index].id,
            password: users[index].password,
            updatedAt: new Date().toISOString(),
        };
        (0, database_1.updateCollection)('users', users);
        return users[index];
    }
    static delete(id) {
        const users = this.getAll();
        const filtered = users.filter(u => u.id !== id);
        if (filtered.length === users.length)
            return false;
        (0, database_1.updateCollection)('users', filtered);
        return true;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map