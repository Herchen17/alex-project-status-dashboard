/**
 * Database Connection Module
 * Handles SQLite database connection with proper error handling
 */
export declare class DatabaseConnection {
    private db;
    private static instance;
    private readonly dbPath;
    private constructor();
    /**
     * Get singleton instance of database connection
     */
    static getInstance(dbPath?: string): DatabaseConnection;
    /**
     * Initialize database connection with proper error handling
     */
    connect(): Promise<void>;
    /**
     * Execute SQL query with parameters
     */
    run(sql: string, params?: any[]): Promise<{
        lastID?: number;
        changes: number;
    }>;
    /**
     * Execute SQL query and return single row
     */
    get<T = any>(sql: string, params?: any[]): Promise<T | undefined>;
    /**
     * Execute SQL query and return all rows
     */
    all<T = any>(sql: string, params?: any[]): Promise<T[]>;
    /**
     * Execute SQL query and return each row via callback
     */
    each<T = any>(sql: string, params: any[] | undefined, callback: (row: T) => void): Promise<number>;
    /**
     * Execute transaction with rollback support
     */
    transaction<T>(callback: () => Promise<T>): Promise<T>;
    /**
     * Close database connection
     */
    close(): Promise<void>;
    /**
     * Check if database is connected
     */
    isConnected(): boolean;
    /**
     * Get database file path
     */
    getDbPath(): string;
}
export declare const getDatabase: (dbPath?: string) => DatabaseConnection;
