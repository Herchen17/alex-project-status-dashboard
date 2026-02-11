/**
 * Medical Clinic Data Validation
 * Gold Coast Medical Clinic Database Project
 */
import { MedicalClinic, MedicalClinicInput, ContactPerson, Address, ValidationResult } from '../types/MedicalClinic.js';
export declare class ClinicValidator {
    /**
     * Validate a complete MedicalClinic object
     */
    static validate(clinic: MedicalClinic): ValidationResult;
    /**
     * Validate MedicalClinicInput (for creation/updates)
     */
    static validateInput(input: MedicalClinicInput): ValidationResult;
    /**
     * Validate Address object
     */
    static validateAddress(address: Address): ValidationResult;
    /**
     * Validate ContactPerson object
     */
    static validateContactPerson(person: ContactPerson): ValidationResult;
}
