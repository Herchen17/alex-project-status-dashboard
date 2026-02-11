/**
 * Database Seeder
 * Initializes database schema and seed data
 */

import { DatabaseConnection, getDatabase } from './connection';
import { DatabaseError } from '../types/MedicalClinic';

export class DatabaseSeeder {
  private db: DatabaseConnection;

  constructor(dbConnection?: DatabaseConnection) {
    this.db = dbConnection || getDatabase();
  }

  /**
   * Initialize database schema
   */
  public async initializeSchema(): Promise<void> {
    try {
      await this.db.connect();

      // Create medical_clinics table
      await this.db.run(`
        CREATE TABLE IF NOT EXISTS medical_clinics (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          
          -- Address components
          address_street TEXT NOT NULL,
          address_suburb TEXT NOT NULL,
          address_state TEXT NOT NULL DEFAULT 'QLD',
          address_postcode TEXT NOT NULL,
          address_latitude REAL NULL,
          address_longitude REAL NULL,
          
          -- Contact information
          phone TEXT NOT NULL,
          email TEXT NULL,
          website TEXT NULL,
          
          -- Business metrics
          ui_rating INTEGER NOT NULL CHECK (ui_rating >= 1 AND ui_rating <= 5),
          staff_count INTEGER NOT NULL CHECK (staff_count >= 1),
          practice_type TEXT NOT NULL CHECK (practice_type IN ('GP', 'Specialist', 'Medical Centre', 'Allied Health', 'Other')),
          established_year INTEGER NULL CHECK (established_year >= 1800 AND established_year <= 2030),
          
          -- Metadata
          notes TEXT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create indexes for medical_clinics
      await this.db.run('CREATE INDEX IF NOT EXISTS idx_suburb ON medical_clinics(address_suburb)');
      await this.db.run('CREATE INDEX IF NOT EXISTS idx_practice_type ON medical_clinics(practice_type)');
      await this.db.run('CREATE INDEX IF NOT EXISTS idx_ui_rating ON medical_clinics(ui_rating)');
      await this.db.run('CREATE INDEX IF NOT EXISTS idx_staff_count ON medical_clinics(staff_count)');
      await this.db.run('CREATE INDEX IF NOT EXISTS idx_postcode ON medical_clinics(address_postcode)');

      // Create specialties table
      await this.db.run(`
        CREATE TABLE IF NOT EXISTS specialties (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          category TEXT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create indexes for specialties
      await this.db.run('CREATE INDEX IF NOT EXISTS idx_specialty_name ON specialties(name)');
      await this.db.run('CREATE INDEX IF NOT EXISTS idx_specialty_category ON specialties(category)');

      // Create clinic_specialties junction table
      await this.db.run(`
        CREATE TABLE IF NOT EXISTS clinic_specialties (
          clinic_id TEXT NOT NULL,
          specialty_id INTEGER NOT NULL,
          PRIMARY KEY (clinic_id, specialty_id),
          FOREIGN KEY (clinic_id) REFERENCES medical_clinics(id) ON DELETE CASCADE,
          FOREIGN KEY (specialty_id) REFERENCES specialties(id) ON DELETE CASCADE
        )
      `);

      // Create decision_makers table
      await this.db.run(`
        CREATE TABLE IF NOT EXISTS decision_makers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          clinic_id TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('Practice Manager', 'Owner', 'Director', 'Administrator', 'Other')),
          phone TEXT NULL,
          email TEXT NULL,
          is_primary BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          
          FOREIGN KEY (clinic_id) REFERENCES medical_clinics(id) ON DELETE CASCADE
        )
      `);

      // Create indexes for decision_makers
      await this.db.run('CREATE INDEX IF NOT EXISTS idx_dm_clinic_id ON decision_makers(clinic_id)');
      await this.db.run('CREATE INDEX IF NOT EXISTS idx_dm_role ON decision_makers(role)');
      await this.db.run('CREATE INDEX IF NOT EXISTS idx_dm_primary ON decision_makers(is_primary)');

      // Create operating_hours table
      await this.db.run(`
        CREATE TABLE IF NOT EXISTS operating_hours (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          clinic_id TEXT NOT NULL,
          day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
          hours TEXT NOT NULL,
          
          FOREIGN KEY (clinic_id) REFERENCES medical_clinics(id) ON DELETE CASCADE,
          UNIQUE (clinic_id, day_of_week)
        )
      `);

      // Create index for operating_hours
      await this.db.run('CREATE INDEX IF NOT EXISTS idx_oh_clinic_id ON operating_hours(clinic_id)');

      console.log('Database schema initialized successfully');
    } catch (error) {
      const dbError = new Error(`Schema initialization failed: ${error instanceof Error ? error.message : String(error)}`) as DatabaseError;
      dbError.code = 'SCHEMA_ERROR';
      throw dbError;
    }
  }

  /**
   * Seed specialties data
   */
  public async seedSpecialties(): Promise<void> {
    try {
      const specialties = [
        // General Practice
        ['General Practice', 'Primary Care'],
        ['Family Medicine', 'Primary Care'],

        // Medical Specialties
        ['Cardiology', 'Medical'],
        ['Dermatology', 'Medical'],
        ['Endocrinology', 'Medical'],
        ['Gastroenterology', 'Medical'],
        ['Geriatrics', 'Medical'],
        ['Neurology', 'Medical'],
        ['Oncology', 'Medical'],
        ['Respiratory Medicine', 'Medical'],
        ['Rheumatology', 'Medical'],

        // Surgical Specialties
        ['General Surgery', 'Surgical'],
        ['Orthopaedic Surgery', 'Surgical'],
        ['Plastic Surgery', 'Surgical'],
        ['Vascular Surgery', 'Surgical'],

        // Women's Health
        ['Obstetrics and Gynaecology', 'Womens Health'],
        ['Fertility Services', 'Womens Health'],

        // Mental Health
        ['Psychiatry', 'Mental Health'],
        ['Psychology', 'Mental Health'],

        // Allied Health
        ['Physiotherapy', 'Allied Health'],
        ['Occupational Therapy', 'Allied Health'],
        ['Podiatry', 'Allied Health'],
        ['Dietetics', 'Allied Health'],
        ['Speech Pathology', 'Allied Health'],

        // Other
        ['Pathology', 'Diagnostic'],
        ['Radiology', 'Diagnostic'],
        ['Pharmacy', 'Other'],
        ['Optometry', 'Other'],
        ['Dentistry', 'Other']
      ];

      for (const [name, category] of specialties) {
        try {
          await this.db.run(
            'INSERT OR IGNORE INTO specialties (name, category) VALUES (?, ?)',
            [name, category]
          );
        } catch (error) {
          // Continue with other specialties if one fails
          console.warn(`Failed to insert specialty ${name}: ${error}`);
        }
      }

      console.log('Specialties seeded successfully');
    } catch (error) {
      const dbError = new Error(`Specialties seeding failed: ${error instanceof Error ? error.message : String(error)}`) as DatabaseError;
      dbError.code = 'SEED_ERROR';
      throw dbError;
    }
  }

  /**
   * Initialize database with schema and seed data
   */
  public async initialize(): Promise<void> {
    try {
      await this.initializeSchema();
      await this.seedSpecialties();
      console.log('Database initialization completed successfully');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Drop all tables (for testing purposes)
   */
  public async dropTables(): Promise<void> {
    try {
      const tables = [
        'operating_hours',
        'decision_makers',
        'clinic_specialties',
        'specialties',
        'medical_clinics'
      ];

      for (const table of tables) {
        await this.db.run(`DROP TABLE IF EXISTS ${table}`);
      }

      console.log('All tables dropped successfully');
    } catch (error) {
      const dbError = new Error(`Table drop failed: ${error instanceof Error ? error.message : String(error)}`) as DatabaseError;
      dbError.code = 'DROP_ERROR';
      throw dbError;
    }
  }

  /**
   * Reset database (drop and recreate)
   */
  public async reset(): Promise<void> {
    await this.dropTables();
    await this.initialize();
    console.log('Database reset completed successfully');
  }
}