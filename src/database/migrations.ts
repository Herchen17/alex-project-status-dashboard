/**
 * Database Migration Scripts
 * Gold Coast Medical Clinic Database Project
 */

import { readFileSync } from 'fs';
import { join } from 'path';

export interface Migration {
  version: string;
  description: string;
  sql: string;
  rollback?: string;
}

export class MigrationManager {
  private migrations: Migration[] = [];

  constructor() {
    this.initializeMigrations();
  }

  private initializeMigrations(): void {
    // Migration 001: Initial schema
    const schemaSql = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    
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

  getMigrations(): Migration[] {
    return [...this.migrations];
  }

  getMigration(version: string): Migration | undefined {
    return this.migrations.find(m => m.version === version);
  }

  getLatestVersion(): string {
    return this.migrations[this.migrations.length - 1]?.version || '000';
  }

  /**
   * Generate SQL for creating migration tracking table
   */
  getMigrationTableSql(): string {
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
  getVersionCheckSql(): string {
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
  getRecordMigrationSql(migration: Migration): string {
    return `
      INSERT INTO schema_migrations (version, description) 
      VALUES ('${migration.version}', '${migration.description.replace(/'/g, "''")}');
    `;
  }

  /**
   * Generate SQL for a complete database setup (all migrations)
   */
  getFullSetupSql(): string {
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

export const migrationManager = new MigrationManager();