/**
 * Database Migration Scripts
 * Gold Coast Medical Clinic Database Project
 */
export interface Migration {
    version: string;
    description: string;
    sql: string;
    rollback?: string;
}
export declare class MigrationManager {
    private migrations;
    constructor();
    private initializeMigrations;
    getMigrations(): Migration[];
    getMigration(version: string): Migration | undefined;
    getLatestVersion(): string;
    /**
     * Generate SQL for creating migration tracking table
     */
    getMigrationTableSql(): string;
    /**
     * Get SQL to check current schema version
     */
    getVersionCheckSql(): string;
    /**
     * Get SQL to record a migration as applied
     */
    getRecordMigrationSql(migration: Migration): string;
    /**
     * Generate SQL for a complete database setup (all migrations)
     */
    getFullSetupSql(): string;
}
export declare const migrationManager: MigrationManager;
