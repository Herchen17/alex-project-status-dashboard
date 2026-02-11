/**
 * Database Seeder
 * Initializes database schema and seed data
 */
import { DatabaseConnection } from './connection';
export declare class DatabaseSeeder {
    private db;
    constructor(dbConnection?: DatabaseConnection);
    /**
     * Initialize database schema
     */
    initializeSchema(): Promise<void>;
    /**
     * Seed specialties data
     */
    seedSpecialties(): Promise<void>;
    /**
     * Initialize database with schema and seed data
     */
    initialize(): Promise<void>;
    /**
     * Drop all tables (for testing purposes)
     */
    dropTables(): Promise<void>;
    /**
     * Reset database (drop and recreate)
     */
    reset(): Promise<void>;
}
