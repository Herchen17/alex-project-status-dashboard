/**
 * Medical Clinic Repository
 * Provides CRUD operations for medical clinic data
 */
import { DatabaseConnection } from './connection';
import { MedicalClinic, MedicalClinicInput } from '../types/MedicalClinic';
export declare class ClinicRepository {
    private db;
    constructor(dbConnection?: DatabaseConnection);
    /**
     * Create a new medical clinic
     */
    create(clinicData: MedicalClinicInput): Promise<MedicalClinic>;
    /**
     * Find clinic by ID
     */
    findById(id: string): Promise<MedicalClinic | null>;
    /**
     * Find all clinics with optional filters
     */
    findAll(filters?: {
        suburb?: string;
        practiceType?: string;
        minUiRating?: number;
        limit?: number;
        offset?: number;
    }): Promise<MedicalClinic[]>;
    /**
     * Update a clinic
     */
    update(id: string, updateData: Partial<MedicalClinicInput>): Promise<MedicalClinic | null>;
    /**
     * Delete a clinic
     */
    delete(id: string): Promise<boolean>;
    /**
     * Count total clinics with optional filters
     */
    count(filters?: {
        suburb?: string;
        practiceType?: string;
        minUiRating?: number;
    }): Promise<number>;
    private buildClinicObject;
    private insertSpecialties;
    private insertDecisionMakers;
    private insertOperatingHours;
    private updateSpecialties;
    private updateDecisionMakers;
    private updateOperatingHours;
}
