/**
 * Medical Clinic Database - Main Exports
 * Gold Coast Medical Clinic Database Project
 */

// Export types
export * from './types/MedicalClinic.js';

// Export validation
export * from './validation/clinicValidator.js';

// Export database utilities
export * from './database/migrations.js';

// Export database components (new in MED-002)
export * from './database/connection.js';
export * from './database/seeder.js';
export * from './database/clinicRepository.js';

// Export middleware (new in MED-002)
export * from './middleware/validationMiddleware.js';