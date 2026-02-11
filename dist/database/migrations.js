"use strict";
/**
 * Database Migration Scripts
 * Gold Coast Medical Clinic Database Project
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrationManager = exports.MigrationManager = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class MigrationManager {
    constructor() {
        this.migrations = [];
        this.initializeMigrations();
    }
    initializeMigrations() {
        // Migration 001: Initial schema
        const schemaSql = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, 'schema.sql'), 'utf-8');
        this.migrations.push({
            version: '001',
            description: 'Create initial medical clinics database schema',
            sql: schemaSql,
            rollback: `
        DROP TABLE IF EXISTS operating_hours;
        DROP TABLE IF EXISTS decision_makers;
        DROP TABLE IF EXISTS clinic_specialties;
        DROP TABLE IF EXISTS specialties;
        DROP TABLE IF EXISTS medical_clinics;
      `
        });
    }
    getMigrations() {
        return [...this.migrations];
    }
    getMigration(version) {
        return this.migrations.find(m => m.version === version);
    }
    getLatestVersion() {
        return this.migrations[this.migrations.length - 1]?.version || '000';
    }
    /**
     * Generate SQL for creating migration tracking table
     */
    getMigrationTableSql() {
        return `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(10) PRIMARY KEY,
        description VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    }
    /**
     * Get SQL to check current schema version
     */
    getVersionCheckSql() {
        return `
      SELECT version 
      FROM schema_migrations 
      ORDER BY version DESC 
      LIMIT 1;
    `;
    }
    /**
     * Get SQL to record a migration as applied
     */
    getRecordMigrationSql(migration) {
        return `
      INSERT INTO schema_migrations (version, description) 
      VALUES ('${migration.version}', '${migration.description.replace(/'/g, "''")}');
    `;
    }
    /**
     * Generate SQL for a complete database setup (all migrations)
     */
    getFullSetupSql() {
        const migrationTableSql = this.getMigrationTableSql();
        const allMigrations = this.migrations.map(m => m.sql).join('\n\n');
        const recordMigrations = this.migrations
            .map(m => this.getRecordMigrationSql(m))
            .join('\n');
        return `
      -- Migration tracking table
      ${migrationTableSql}

      -- Apply all migrations
      ${allMigrations}

      -- Record applied migrations
      ${recordMigrations}
    `;
    }
}
exports.MigrationManager = MigrationManager;
exports.migrationManager = new MigrationManager();
//# sourceMappingURL=migrations.js.map