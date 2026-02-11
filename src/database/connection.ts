/**
 * Database Connection Module
 * Handles SQLite database connection with proper error handling
 */

import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import { DatabaseError } from '../types/MedicalClinic';

export class DatabaseConnection {
  private db: sqlite3.Database | null = null;
  private static instance: DatabaseConnection | null = null;
  private readonly dbPath: string;

  private constructor(dbPath?: string) {
    this.dbPath = dbPath || path.join(process.cwd(), 'data', 'medical_clinics.db');
  }

  /**
   * Get singleton instance of database connection
   */
  public static getInstance(dbPath?: string): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(dbPath);
    }
    return DatabaseConnection.instance;
  }

  /**
   * Initialize database connection with proper error handling
   */
  public async connect(): Promise<void> {
    if (this.db) {
      return; // Already connected
    }

    try {
      // Ensure data directory exists
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      this.db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
          const dbError = new Error(`Database connection failed: ${err.message}`) as DatabaseError;
          dbError.code = 'CONNECTION_ERROR';
          throw dbError;
        }
      });

      // Enable foreign key constraints
      await this.run('PRAGMA foreign_keys = ON');
      
      // Set WAL mode for better concurrency
      await this.run('PRAGMA journal_mode = WAL');

      console.log(`Connected to SQLite database at ${this.dbPath}`);
    } catch (error) {
      const dbError = new Error(`Failed to initialize database: ${error instanceof Error ? error.message : String(error)}`) as DatabaseError;
      dbError.code = 'INITIALIZATION_ERROR';
      throw dbError;
    }
  }

  /**
   * Execute SQL query with parameters
   */
  public async run(sql: string, params: any[] = []): Promise<{ lastID?: number; changes: number }> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    return new Promise((resolve, reject) => {
      this.db!.run(sql, params, function(err) {
        if (err) {
          const dbError = new Error(`SQL execution error: ${err.message}`) as DatabaseError;
          dbError.code = 'SQL_ERROR';
          reject(dbError);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  /**
   * Execute SQL query and return single row
   */
  public async get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    return new Promise((resolve, reject) => {
      this.db!.get(sql, params, (err, row) => {
        if (err) {
          const dbError = new Error(`SQL query error: ${err.message}`) as DatabaseError;
          dbError.code = 'QUERY_ERROR';
          reject(dbError);
        } else {
          resolve(row as T);
        }
      });
    });
  }

  /**
   * Execute SQL query and return all rows
   */
  public async all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    return new Promise((resolve, reject) => {
      this.db!.all(sql, params, (err, rows) => {
        if (err) {
          const dbError = new Error(`SQL query error: ${err.message}`) as DatabaseError;
          dbError.code = 'QUERY_ERROR';
          reject(dbError);
        } else {
          resolve(rows as T[]);
        }
      });
    });
  }

  /**
   * Execute SQL query and return each row via callback
   */
  public async each<T = any>(sql: string, params: any[] = [], callback: (row: T) => void): Promise<number> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    return new Promise((resolve, reject) => {
      this.db!.each(sql, params, (err, row) => {
        if (err) {
          const dbError = new Error(`SQL query error: ${err.message}`) as DatabaseError;
          dbError.code = 'QUERY_ERROR';
          reject(dbError);
        } else {
          callback(row as T);
        }
      }, (err, count) => {
        if (err) {
          reject(err);
        } else {
          resolve(count);
        }
      });
    });
  }

  /**
   * Execute transaction with rollback support
   */
  public async transaction<T>(callback: () => Promise<T>): Promise<T> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    await this.run('BEGIN TRANSACTION');
    
    try {
      const result = await callback();
      await this.run('COMMIT');
      return result;
    } catch (error) {
      await this.run('ROLLBACK');
      throw error;
    }
  }

  /**
   * Close database connection
   */
  public async close(): Promise<void> {
    if (this.db) {
      return new Promise((resolve, reject) => {
        this.db!.close((err) => {
          if (err) {
            reject(err);
          } else {
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
  public isConnected(): boolean {
    return this.db !== null;
  }

  /**
   * Get database file path
   */
  public getDbPath(): string {
    return this.dbPath;
  }
}

// Export singleton instance getter
export const getDatabase = (dbPath?: string): DatabaseConnection => {
  return DatabaseConnection.getInstance(dbPath);
};