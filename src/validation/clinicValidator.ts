/**
 * Medical Clinic Data Validation
 * Gold Coast Medical Clinic Database Project
 */

import { MedicalClinic, MedicalClinicInput, ContactPerson, Address, ValidationResult } from '../types/MedicalClinic.js';

export class ClinicValidator {
  
  /**
   * Validate a complete MedicalClinic object
   */
  static validate(clinic: MedicalClinic): ValidationResult {
    const errors: string[] = [];

    // Validate ID
    if (!clinic.id || typeof clinic.id !== 'string' || clinic.id.trim().length === 0) {
      errors.push('ID is required and must be a non-empty string');
    }

    // Validate basic clinic input
    const inputErrors = this.validateInput({
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone,
      email: clinic.email,
      website: clinic.website,
      uiRating: clinic.uiRating,
      staffCount: clinic.staffCount,
      specialties: clinic.specialties,
      decisionMakers: clinic.decisionMakers,
      practiceType: clinic.practiceType,
      establishedYear: clinic.establishedYear,
      operatingHours: clinic.operatingHours,
      notes: clinic.notes
    }).errors;

    errors.push(...inputErrors);

    // Validate timestamps
    if (!clinic.lastUpdated || !(clinic.lastUpdated instanceof Date)) {
      errors.push('lastUpdated must be a valid Date object');
    }

    if (!clinic.createdAt || !(clinic.createdAt instanceof Date)) {
      errors.push('createdAt must be a valid Date object');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate MedicalClinicInput (for creation/updates)
   */
  static validateInput(input: MedicalClinicInput): ValidationResult {
    const errors: string[] = [];

    // Validate name
    if (!input.name || typeof input.name !== 'string' || input.name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string');
    } else if (input.name.length > 255) {
      errors.push('Name must be 255 characters or less');
    }

    // Validate address
    const addressErrors = this.validateAddress(input.address);
    errors.push(...addressErrors.errors);

    // Validate phone
    if (!input.phone || typeof input.phone !== 'string') {
      errors.push('Phone is required and must be a string');
    } else if (!/^[\+\d\s\-\(\)]+$/.test(input.phone)) {
      errors.push('Phone contains invalid characters');
    }

    // Validate email (optional)
    if (input.email !== undefined) {
      if (typeof input.email !== 'string') {
        errors.push('Email must be a string');
      } else if (input.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
        errors.push('Email must be a valid email address');
      }
    }

    // Validate website (optional)
    if (input.website !== undefined) {
      if (typeof input.website !== 'string') {
        errors.push('Website must be a string');
      } else if (input.website.length > 0) {
        try {
          new URL(input.website);
        } catch {
          errors.push('Website must be a valid URL');
        }
      }
    }

    // Validate UI rating
    if (typeof input.uiRating !== 'number') {
      errors.push('UI rating must be a number');
    } else if (!Number.isInteger(input.uiRating) || input.uiRating < 1 || input.uiRating > 5) {
      errors.push('UI rating must be an integer between 1 and 5');
    }

    // Validate staff count
    if (typeof input.staffCount !== 'number') {
      errors.push('Staff count must be a number');
    } else if (!Number.isInteger(input.staffCount) || input.staffCount < 1) {
      errors.push('Staff count must be a positive integer');
    }

    // Validate specialties
    if (!Array.isArray(input.specialties)) {
      errors.push('Specialties must be an array');
    } else if (input.specialties.length === 0) {
      errors.push('At least one specialty is required');
    } else {
      input.specialties.forEach((specialty, index) => {
        if (typeof specialty !== 'string' || specialty.trim().length === 0) {
          errors.push(`Specialty at index ${index} must be a non-empty string`);
        }
      });
    }

    // Validate decision makers
    if (!Array.isArray(input.decisionMakers)) {
      errors.push('Decision makers must be an array');
    } else if (input.decisionMakers.length === 0) {
      errors.push('At least one decision maker is required');
    } else {
      input.decisionMakers.forEach((person, index) => {
        const personErrors = this.validateContactPerson(person);
        personErrors.errors.forEach(error => {
          errors.push(`Decision maker ${index + 1}: ${error}`);
        });
      });
    }

    // Validate practice type
    const validPracticeTypes = ['GP', 'Specialist', 'Medical Centre', 'Allied Health', 'Other'];
    if (!validPracticeTypes.includes(input.practiceType)) {
      errors.push(`Practice type must be one of: ${validPracticeTypes.join(', ')}`);
    }

    // Validate established year (optional)
    if (input.establishedYear !== undefined) {
      const currentYear = new Date().getFullYear();
      if (typeof input.establishedYear !== 'number' || 
          !Number.isInteger(input.establishedYear) || 
          input.establishedYear < 1800 || 
          input.establishedYear > currentYear) {
        errors.push('Established year must be a valid year between 1800 and current year');
      }
    }

    // Validate operating hours (optional)
    if (input.operatingHours !== undefined) {
      const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      if (typeof input.operatingHours !== 'object') {
        errors.push('Operating hours must be an object');
      } else {
        Object.keys(input.operatingHours).forEach(day => {
          if (!validDays.includes(day)) {
            errors.push(`Operating hours: '${day}' is not a valid day of the week`);
          }
          if (typeof input.operatingHours![day] !== 'string') {
            errors.push(`Operating hours for ${day} must be a string`);
          }
        });
      }
    }

    // Validate notes (optional)
    if (input.notes !== undefined && typeof input.notes !== 'string') {
      errors.push('Notes must be a string');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate Address object
   */
  static validateAddress(address: Address): ValidationResult {
    const errors: string[] = [];

    if (!address || typeof address !== 'object') {
      errors.push('Address is required and must be an object');
      return { isValid: false, errors };
    }

    if (!address.street || typeof address.street !== 'string' || address.street.trim().length === 0) {
      errors.push('Address street is required and must be a non-empty string');
    }

    if (!address.suburb || typeof address.suburb !== 'string' || address.suburb.trim().length === 0) {
      errors.push('Address suburb is required and must be a non-empty string');
    }

    if (!address.state || typeof address.state !== 'string' || address.state.trim().length === 0) {
      errors.push('Address state is required and must be a non-empty string');
    }

    if (!address.postcode || typeof address.postcode !== 'string' || address.postcode.trim().length === 0) {
      errors.push('Address postcode is required and must be a non-empty string');
    } else if (!/^\d{4}$/.test(address.postcode)) {
      errors.push('Address postcode must be a 4-digit number');
    }

    // Validate coordinates (optional)
    if (address.coordinates !== undefined) {
      if (typeof address.coordinates !== 'object') {
        errors.push('Address coordinates must be an object');
      } else {
        if (typeof address.coordinates.latitude !== 'number' || 
            address.coordinates.latitude < -90 || 
            address.coordinates.latitude > 90) {
          errors.push('Address coordinates latitude must be a number between -90 and 90');
        }
        
        if (typeof address.coordinates.longitude !== 'number' || 
            address.coordinates.longitude < -180 || 
            address.coordinates.longitude > 180) {
          errors.push('Address coordinates longitude must be a number between -180 and 180');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate ContactPerson object
   */
  static validateContactPerson(person: ContactPerson): ValidationResult {
    const errors: string[] = [];

    if (!person || typeof person !== 'object') {
      errors.push('Contact person is required and must be an object');
      return { isValid: false, errors };
    }

    if (!person.name || typeof person.name !== 'string' || person.name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string');
    }

    const validRoles = ['Practice Manager', 'Owner', 'Director', 'Administrator', 'Other'];
    if (!validRoles.includes(person.role)) {
      errors.push(`Role must be one of: ${validRoles.join(', ')}`);
    }

    // Validate phone (optional)
    if (person.phone !== undefined) {
      if (typeof person.phone !== 'string') {
        errors.push('Phone must be a string');
      } else if (person.phone.length > 0 && !/^[\+\d\s\-\(\)]+$/.test(person.phone)) {
        errors.push('Phone contains invalid characters');
      }
    }

    // Validate email (optional)
    if (person.email !== undefined) {
      if (typeof person.email !== 'string') {
        errors.push('Email must be a string');
      } else if (person.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)) {
        errors.push('Email must be a valid email address');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}