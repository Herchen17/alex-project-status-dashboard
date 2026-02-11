/**
 * Medical Clinic Repository
 * Provides CRUD operations for medical clinic data
 */

import { v4 as uuidv4 } from 'uuid';
import { DatabaseConnection, getDatabase } from './connection';
import { MedicalClinic, MedicalClinicInput, ContactPerson, DatabaseError } from '../types/MedicalClinic';

interface ClinicRow {
  id: string;
  name: string;
  address_street: string;
  address_suburb: string;
  address_state: string;
  address_postcode: string;
  address_latitude?: number;
  address_longitude?: number;
  phone: string;
  email?: string;
  website?: string;
  ui_rating: number;
  staff_count: number;
  practice_type: string;
  established_year?: number;
  notes?: string;
  created_at: string;
  last_updated: string;
}

export class ClinicRepository {
  private db: DatabaseConnection;

  constructor(dbConnection?: DatabaseConnection) {
    this.db = dbConnection || getDatabase();
  }

  /**
   * Create a new medical clinic
   */
  public async create(clinicData: MedicalClinicInput): Promise<MedicalClinic> {
    try {
      if (!this.db.isConnected()) {
        await this.db.connect();
      }

      const id = uuidv4();
      const now = new Date().toISOString();

      return await this.db.transaction(async () => {
        // Insert main clinic data
        await this.db.run(`
          INSERT INTO medical_clinics (
            id, name, address_street, address_suburb, address_state, address_postcode,
            address_latitude, address_longitude, phone, email, website,
            ui_rating, staff_count, practice_type, established_year, notes,
            created_at, last_updated
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id, clinicData.name, clinicData.address.street, clinicData.address.suburb,
          clinicData.address.state, clinicData.address.postcode,
          clinicData.address.coordinates?.latitude || null,
          clinicData.address.coordinates?.longitude || null,
          clinicData.phone, clinicData.email || null, clinicData.website || null,
          clinicData.uiRating, clinicData.staffCount, clinicData.practiceType,
          clinicData.establishedYear || null, clinicData.notes || null,
          now, now
        ]);

        // Insert specialties
        await this.insertSpecialties(id, clinicData.specialties);

        // Insert decision makers
        await this.insertDecisionMakers(id, clinicData.decisionMakers);

        // Insert operating hours
        if (clinicData.operatingHours) {
          await this.insertOperatingHours(id, clinicData.operatingHours);
        }

        // Fetch and return the created clinic
        const clinic = await this.findById(id);
        if (!clinic) {
          throw new Error('Failed to retrieve created clinic');
        }
        
        return clinic;
      });

    } catch (error) {
      const dbError = new Error(`Failed to create clinic: ${error instanceof Error ? error.message : String(error)}`) as DatabaseError;
      dbError.code = 'CREATE_ERROR';
      throw dbError;
    }
  }

  /**
   * Find clinic by ID
   */
  public async findById(id: string): Promise<MedicalClinic | null> {
    try {
      if (!this.db.isConnected()) {
        await this.db.connect();
      }

      const clinicRow = await this.db.get<ClinicRow>(`
        SELECT * FROM medical_clinics WHERE id = ?
      `, [id]);

      if (!clinicRow) {
        return null;
      }

      return await this.buildClinicObject(clinicRow);

    } catch (error) {
      const dbError = new Error(`Failed to find clinic by ID: ${error instanceof Error ? error.message : String(error)}`) as DatabaseError;
      dbError.code = 'READ_ERROR';
      throw dbError;
    }
  }

  /**
   * Find all clinics with optional filters
   */
  public async findAll(filters?: {
    suburb?: string;
    practiceType?: string;
    minUiRating?: number;
    limit?: number;
    offset?: number;
  }): Promise<MedicalClinic[]> {
    try {
      if (!this.db.isConnected()) {
        await this.db.connect();
      }

      let sql = 'SELECT * FROM medical_clinics WHERE 1=1';
      const params: any[] = [];

      // Apply filters
      if (filters?.suburb) {
        sql += ' AND LOWER(address_suburb) LIKE LOWER(?)';
        params.push(`%${filters.suburb}%`);
      }
      
      if (filters?.practiceType) {
        sql += ' AND practice_type = ?';
        params.push(filters.practiceType);
      }
      
      if (filters?.minUiRating) {
        sql += ' AND ui_rating >= ?';
        params.push(filters.minUiRating);
      }

      // Add ordering and pagination
      sql += ' ORDER BY name ASC';
      
      if (filters?.limit) {
        sql += ' LIMIT ?';
        params.push(filters.limit);
        
        if (filters?.offset) {
          sql += ' OFFSET ?';
          params.push(filters.offset);
        }
      }

      const rows = await this.db.all<ClinicRow>(sql, params);
      
      const clinics: MedicalClinic[] = [];
      for (const row of rows) {
        clinics.push(await this.buildClinicObject(row));
      }
      
      return clinics;

    } catch (error) {
      const dbError = new Error(`Failed to find clinics: ${error instanceof Error ? error.message : String(error)}`) as DatabaseError;
      dbError.code = 'READ_ERROR';
      throw dbError;
    }
  }

  /**
   * Update a clinic
   */
  public async update(id: string, updateData: Partial<MedicalClinicInput>): Promise<MedicalClinic | null> {
    try {
      if (!this.db.isConnected()) {
        await this.db.connect();
      }

      // Check if clinic exists
      const existingClinic = await this.findById(id);
      if (!existingClinic) {
        return null;
      }

      return await this.db.transaction(async () => {
        // Build dynamic update query
        const updateFields: string[] = [];
        const params: any[] = [];

        if (updateData.name) {
          updateFields.push('name = ?');
          params.push(updateData.name);
        }

        if (updateData.address) {
          if (updateData.address.street) {
            updateFields.push('address_street = ?');
            params.push(updateData.address.street);
          }
          if (updateData.address.suburb) {
            updateFields.push('address_suburb = ?');
            params.push(updateData.address.suburb);
          }
          if (updateData.address.state) {
            updateFields.push('address_state = ?');
            params.push(updateData.address.state);
          }
          if (updateData.address.postcode) {
            updateFields.push('address_postcode = ?');
            params.push(updateData.address.postcode);
          }
          if (updateData.address.coordinates) {
            updateFields.push('address_latitude = ?, address_longitude = ?');
            params.push(updateData.address.coordinates.latitude, updateData.address.coordinates.longitude);
          }
        }

        if (updateData.phone) {
          updateFields.push('phone = ?');
          params.push(updateData.phone);
        }

        if (updateData.email !== undefined) {
          updateFields.push('email = ?');
          params.push(updateData.email);
        }

        if (updateData.website !== undefined) {
          updateFields.push('website = ?');
          params.push(updateData.website);
        }

        if (updateData.uiRating) {
          updateFields.push('ui_rating = ?');
          params.push(updateData.uiRating);
        }

        if (updateData.staffCount) {
          updateFields.push('staff_count = ?');
          params.push(updateData.staffCount);
        }

        if (updateData.practiceType) {
          updateFields.push('practice_type = ?');
          params.push(updateData.practiceType);
        }

        if (updateData.establishedYear !== undefined) {
          updateFields.push('established_year = ?');
          params.push(updateData.establishedYear);
        }

        if (updateData.notes !== undefined) {
          updateFields.push('notes = ?');
          params.push(updateData.notes);
        }

        // Always update last_updated timestamp
        updateFields.push('last_updated = ?');
        params.push(new Date().toISOString());
        params.push(id);

        // Execute update if there are fields to update
        if (updateFields.length > 1) { // > 1 because last_updated is always included
          const sql = `UPDATE medical_clinics SET ${updateFields.join(', ')} WHERE id = ?`;
          await this.db.run(sql, params);
        }

        // Update related data if provided
        if (updateData.specialties) {
          await this.updateSpecialties(id, updateData.specialties);
        }

        if (updateData.decisionMakers) {
          await this.updateDecisionMakers(id, updateData.decisionMakers);
        }

        if (updateData.operatingHours) {
          await this.updateOperatingHours(id, updateData.operatingHours);
        }

        // Return updated clinic
        return await this.findById(id);
      });

    } catch (error) {
      const dbError = new Error(`Failed to update clinic: ${error instanceof Error ? error.message : String(error)}`) as DatabaseError;
      dbError.code = 'UPDATE_ERROR';
      throw dbError;
    }
  }

  /**
   * Delete a clinic
   */
  public async delete(id: string): Promise<boolean> {
    try {
      if (!this.db.isConnected()) {
        await this.db.connect();
      }

      const result = await this.db.run('DELETE FROM medical_clinics WHERE id = ?', [id]);
      return result.changes > 0;

    } catch (error) {
      const dbError = new Error(`Failed to delete clinic: ${error instanceof Error ? error.message : String(error)}`) as DatabaseError;
      dbError.code = 'DELETE_ERROR';
      throw dbError;
    }
  }

  /**
   * Count total clinics with optional filters
   */
  public async count(filters?: {
    suburb?: string;
    practiceType?: string;
    minUiRating?: number;
  }): Promise<number> {
    try {
      if (!this.db.isConnected()) {
        await this.db.connect();
      }

      let sql = 'SELECT COUNT(*) as count FROM medical_clinics WHERE 1=1';
      const params: any[] = [];

      // Apply filters (same as in findAll)
      if (filters?.suburb) {
        sql += ' AND LOWER(address_suburb) LIKE LOWER(?)';
        params.push(`%${filters.suburb}%`);
      }
      
      if (filters?.practiceType) {
        sql += ' AND practice_type = ?';
        params.push(filters.practiceType);
      }
      
      if (filters?.minUiRating) {
        sql += ' AND ui_rating >= ?';
        params.push(filters.minUiRating);
      }

      const result = await this.db.get<{ count: number }>(sql, params);
      return result?.count || 0;

    } catch (error) {
      const dbError = new Error(`Failed to count clinics: ${error instanceof Error ? error.message : String(error)}`) as DatabaseError;
      dbError.code = 'COUNT_ERROR';
      throw dbError;
    }
  }

  // Private helper methods

  private async buildClinicObject(row: ClinicRow): Promise<MedicalClinic> {
    // Fetch specialties
    const specialtyRows = await this.db.all<{ name: string }>(`
      SELECT s.name 
      FROM specialties s 
      JOIN clinic_specialties cs ON s.id = cs.specialty_id 
      WHERE cs.clinic_id = ?
    `, [row.id]);

    // Fetch decision makers
    const decisionMakerRows = await this.db.all<{
      name: string;
      role: string;
      phone?: string;
      email?: string;
    }>(`
      SELECT name, role, phone, email 
      FROM decision_makers 
      WHERE clinic_id = ?
    `, [row.id]);

    // Fetch operating hours
    const operatingHoursRows = await this.db.all<{
      day_of_week: string;
      hours: string;
    }>(`
      SELECT day_of_week, hours 
      FROM operating_hours 
      WHERE clinic_id = ?
    `, [row.id]);

    // Build the clinic object
    const clinic: MedicalClinic = {
      id: row.id,
      name: row.name,
      address: {
        street: row.address_street,
        suburb: row.address_suburb,
        state: row.address_state,
        postcode: row.address_postcode,
        coordinates: (row.address_latitude && row.address_longitude) ? {
          latitude: row.address_latitude,
          longitude: row.address_longitude
        } : undefined
      },
      phone: row.phone,
      email: row.email || undefined,
      website: row.website || undefined,
      uiRating: row.ui_rating,
      staffCount: row.staff_count,
      practiceType: row.practice_type as any,
      establishedYear: row.established_year || undefined,
      specialties: specialtyRows.map(s => s.name),
      decisionMakers: decisionMakerRows.map(dm => ({
        name: dm.name,
        role: dm.role as ContactPerson['role'],
        phone: dm.phone || undefined,
        email: dm.email || undefined
      })),
      operatingHours: operatingHoursRows.reduce((hours, row) => {
        hours[row.day_of_week] = row.hours;
        return hours;
      }, {} as { [key: string]: string }),
      notes: row.notes || undefined,
      createdAt: new Date(row.created_at),
      lastUpdated: new Date(row.last_updated)
    };

    return clinic;
  }

  private async insertSpecialties(clinicId: string, specialties: string[]): Promise<void> {
    for (const specialtyName of specialties) {
      // Find or create specialty
      let specialty = await this.db.get<{ id: number }>('SELECT id FROM specialties WHERE name = ?', [specialtyName]);
      
      if (!specialty) {
        const result = await this.db.run('INSERT INTO specialties (name) VALUES (?)', [specialtyName]);
        specialty = { id: result.lastID! };
      }

      // Link clinic to specialty
      await this.db.run('INSERT OR IGNORE INTO clinic_specialties (clinic_id, specialty_id) VALUES (?, ?)', 
        [clinicId, specialty.id]);
    }
  }

  private async insertDecisionMakers(clinicId: string, decisionMakers: ContactPerson[]): Promise<void> {
    for (const dm of decisionMakers) {
      await this.db.run(`
        INSERT INTO decision_makers (clinic_id, name, role, phone, email) 
        VALUES (?, ?, ?, ?, ?)
      `, [clinicId, dm.name, dm.role, dm.phone || null, dm.email || null]);
    }
  }

  private async insertOperatingHours(clinicId: string, operatingHours: { [key: string]: string }): Promise<void> {
    for (const [day, hours] of Object.entries(operatingHours)) {
      await this.db.run(`
        INSERT OR REPLACE INTO operating_hours (clinic_id, day_of_week, hours) 
        VALUES (?, ?, ?)
      `, [clinicId, day, hours]);
    }
  }

  private async updateSpecialties(clinicId: string, specialties: string[]): Promise<void> {
    // Remove existing specialties
    await this.db.run('DELETE FROM clinic_specialties WHERE clinic_id = ?', [clinicId]);
    
    // Insert new specialties
    await this.insertSpecialties(clinicId, specialties);
  }

  private async updateDecisionMakers(clinicId: string, decisionMakers: ContactPerson[]): Promise<void> {
    // Remove existing decision makers
    await this.db.run('DELETE FROM decision_makers WHERE clinic_id = ?', [clinicId]);
    
    // Insert new decision makers
    await this.insertDecisionMakers(clinicId, decisionMakers);
  }

  private async updateOperatingHours(clinicId: string, operatingHours: { [key: string]: string }): Promise<void> {
    // Remove existing operating hours
    await this.db.run('DELETE FROM operating_hours WHERE clinic_id = ?', [clinicId]);
    
    // Insert new operating hours
    await this.insertOperatingHours(clinicId, operatingHours);
  }
}