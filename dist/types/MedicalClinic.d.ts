/**
 * Medical Clinic Data Types
 * For Gold Coast Medical Clinic Database Project
 */
export interface ContactPerson {
    name: string;
    role: 'Practice Manager' | 'Owner' | 'Director' | 'Administrator' | 'Other';
    phone?: string;
    email?: string;
}
export interface Address {
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}
export interface MedicalClinic {
    id: string;
    name: string;
    address: Address;
    phone: string;
    email?: string;
    website?: string;
    uiRating: number;
    staffCount: number;
    specialties: string[];
    decisionMakers: ContactPerson[];
    practiceType: 'GP' | 'Specialist' | 'Medical Centre' | 'Allied Health' | 'Other';
    establishedYear?: number;
    operatingHours?: {
        [key: string]: string;
    };
    notes?: string;
    lastUpdated: Date;
    createdAt: Date;
}
export interface MedicalClinicInput {
    name: string;
    address: Address;
    phone: string;
    email?: string;
    website?: string;
    uiRating: number;
    staffCount: number;
    specialties: string[];
    decisionMakers: ContactPerson[];
    practiceType: 'GP' | 'Specialist' | 'Medical Centre' | 'Allied Health' | 'Other';
    establishedYear?: number;
    operatingHours?: {
        [key: string]: string;
    };
    notes?: string;
}
export interface DatabaseError extends Error {
    code: string;
    field?: string;
}
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
