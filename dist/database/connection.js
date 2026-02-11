"use strict";
/**
 * Database Connection Module
 * Handles SQLite database connection with proper error handling
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabase = exports.DatabaseConnection = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class DatabaseConnection {
    constructor(dbPath) {
        this.db = null;
        this.dbPath = dbPath || path.join(process.cwd(), 'data', 'medical_clinics.db');
    }
    /**
     * Get singleton instance of database connection
     */
    static getInstance(dbPath) {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection(dbPath);
        }
        return DatabaseConnection.instance;
    }
    /**
     * Initialize database connection with proper error handling
     */
    async connect() {
        if (this.db) {
            return; // Already connected
        }
        try {
            // Ensure data directory exists
            const dataDir = path.dirname(this.dbPath);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            this.db = new sqlite3_1.default.Database(this.dbPath, sqlite3_1.default.OPEN_READWRITE | sqlite3_1.default.OPEN_CREATE, (err) => {
                if (err) {
                    const dbError = new Error(`Database connection failed: ${err.message}`);
                    dbError.code = 'CONNECTION_ERROR';
                    throw dbError;
                }
            });
            // Enable foreign key constraints
            await this.run('PRAGMA foreign_keys = ON');
            // Set WAL mode for better concurrency
            await this.run('PRAGMA journal_mode = WAL');
            console.log(`Connected to SQLite database at ${this.dbPath}`);
        }
        catch (error) {
            const dbError = new Error(`Failed to initialize database: ${error instanceof Error ? error.message : String(error)}`);
            dbError.code = 'INITIALIZATION_ERROR';
            throw dbError;
        }
    }
    /**
     * Execute SQL query with parameters
     */
    async run(sql, params = []) {
        if (!this.db) {
            throw new Error('Database not connected');
        }
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    const dbError = new Error(`SQL execution error: ${err.message}`);
                    dbError.code = 'SQL_ERROR';
                    reject(dbError);
                }
                else {
                    resolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        });
    }
    /**
     * Execute SQL query and return single row
     */
    async get(sql, params = []) {
        if (!this.db) {
            throw new Error('Database not connected');
        }
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    const dbError = new Error(`SQL query error: ${err.message}`);
                    dbError.code = 'QUERY_ERROR';
                    reject(dbError);
                }
                else {
                    resolve(row);
                }
            });
        });
    }
    /**
     * Execute SQL query and return all rows
     */
    async all(sql, params = []) {
        if (!this.db) {
            throw new Error('Database not connected');
        }
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    const dbError = new Error(`SQL query error: ${err.message}`);
                    dbError.code = 'QUERY_ERROR';
                    reject(dbError);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    /**
     * Execute SQL query and return each row via callback
     */
    async each(sql, params = [], callback) {
        if (!this.db) {
            throw new Error('Database not connected');
        }
        return new Promise((resolve, reject) => {
            this.db.each(sql, params, (err, row) => {
                if (err) {
                    const dbError = new Error(`SQL query error: ${err.message}`);
                    dbError.code = 'QUERY_ERROR';
                    reject(dbError);
                }
                else {
                    callback(row);
                }
            }, (err, count) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(count);
                }
            });
        });
    }
    /**
     * Execute transaction with rollback support
     */
    async transaction(callback) {
        if (!this.db) {
            throw new Error('Database not connected');
        }
        await this.run('BEGIN TRANSACTION');
        try {
            const result = await callback();
            await this.run('COMMIT');
            return result;
        }
        catch (error) {
            await this.run('ROLLBACK');
            throw error;
        }
    }
    /**
     * Close database connection
     */
    async close() {
        if (this.db) {
            return new Promise((resolve, reject) => {
                this.db.close((err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        this.db = null;
                        DatabaseConnection.instance = null;
                        resolve();
                    }
                });
            });
        }
    }
    /**
     * Check if database is connected
     */
    isConnected() {
        return this.db !== null;
    }
    /**
     * Get database file path
     */
    getDbPath() {
        return this.dbPath;
    }
}
exports.DatabaseConnection = DatabaseConnection;
DatabaseConnection.instance = null;
// Export singleton instance getter
const getDatabase = (dbPath) => {
    return DatabaseConnection.getInstance(dbPath);
};
exports.getDatabase = getDatabase;
//# sourceMappingURL=connection.js.map