"use strict";
/**
 * Validation Middleware
 * Provides validation middleware functions for medical clinic operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBatchClinicInputs = exports.validateId = exports.validateQueryFilters = exports.validateClinic = exports.validatePartialClinicInput = exports.validateClinicInput = exports.ValidationMiddleware = void 0;
const clinicValidator_1 = require("../validation/clinicValidator");
class ValidationMiddleware {
    /**
     * Validate medical clinic input data
     */
    static async validateClinicInput(data, options = {}) {
        try {
            const result = clinicValidator_1.ClinicValidator.validateInput(data);
            if (!result.isValid) {
                if (options.strict) {
                    const error = new Error(`Validation failed: ${result.errors.join(', ')}`);
                    error.code = 'VALIDATION_ERROR';
                    throw error;
                }
                return { isValid: false, errors: result.errors };
            }
            // Apply custom validation rules if provided
            if (options.customRules) {
                const customErrors = this.applyCustomRules(data, options.customRules);
                if (customErrors.length > 0) {
                    if (options.strict) {
                        const error = new Error(`Custom validation failed: ${customErrors.join(', ')}`);
                        error.code = 'CUSTOM_VALIDATION_ERROR';
                        throw error;
                    }
                    return { isValid: false, errors: customErrors };
                }
            }
            return { isValid: true, data: data, errors: [] };
        }
        catch (error) {
            const validationError = error;
            if (validationError.code) {
                throw validationError;
            }
            const dbError = new Error(`Validation middleware error: ${error instanceof Error ? error.message : String(error)}`);
            dbError.code = 'MIDDLEWARE_ERROR';
            throw dbError;
        }
    }
    /**
     * Validate partial clinic data for updates
     */
    static async validatePartialClinicInput(data, options = {}) {
        try {
            const result = this.validatePartialInputData(data);
            if (!result.isValid) {
                if (options.strict) {
                    const error = new Error(`Partial validation failed: ${result.errors.join(', ')}`);
                    error.code = 'PARTIAL_VALIDATION_ERROR';
                    throw error;
                }
                return { isValid: false, errors: result.errors };
            }
            // Apply custom validation rules if provided
            if (options.customRules) {
                const customErrors = this.applyCustomRules(data, options.customRules);
                if (customErrors.length > 0) {
                    if (options.strict) {
                        const error = new Error(`Custom partial validation failed: ${customErrors.join(', ')}`);
                        error.code = 'CUSTOM_PARTIAL_VALIDATION_ERROR';
                        throw error;
                    }
                    return { isValid: false, errors: customErrors };
                }
            }
            return { isValid: true, data: data, errors: [] };
        }
        catch (error) {
            const validationError = error;
            if (validationError.code) {
                throw validationError;
            }
            const dbError = new Error(`Partial validation middleware error: ${error instanceof Error ? error.message : String(error)}`);
            dbError.code = 'PARTIAL_MIDDLEWARE_ERROR';
            throw dbError;
        }
    }
    /**
     * Validate complete clinic data
     */
    static async validateClinic(data, options = {}) {
        try {
            const result = clinicValidator_1.ClinicValidator.validate(data);
            if (!result.isValid) {
                if (options.strict) {
                    const error = new Error(`Clinic validation failed: ${result.errors.join(', ')}`);
                    error.code = 'CLINIC_VALIDATION_ERROR';
                    throw error;
                }
                return { isValid: false, errors: result.errors };
            }
            return { isValid: true, data: data, errors: [] };
        }
        catch (error) {
            const validationError = error;
            if (validationError.code) {
                throw validationError;
            }
            const dbError = new Error(`Clinic validation middleware error: ${error instanceof Error ? error.message : String(error)}`);
            dbError.code = 'CLINIC_MIDDLEWARE_ERROR';
            throw dbError;
        }
    }
    /**
     * Validate query filters for database operations
     */
    static validateQueryFilters(filters) {
        const errors = [];
        if (!filters || typeof filters !== 'object') {
            return { isValid: true, data: {}, errors: [] };
        }
        const validFilters = filters;
        const allowedFields = ['suburb', 'practiceType', 'minUiRating', 'limit', 'offset'];
        const sanitizedFilters = {};
        // Check for valid fields
        for (const [key, value] of Object.entries(validFilters)) {
            if (!allowedFields.includes(key)) {
                errors.push(`Invalid filter field: ${key}`);
                continue;
            }
            // Validate specific fields
            switch (key) {
                case 'suburb':
                    if (typeof value === 'string' && value.trim().length > 0) {
                        sanitizedFilters[key] = value.trim();
                    }
                    else {
                        errors.push('Suburb filter must be a non-empty string');
                    }
                    break;
                case 'practiceType':
                    const validTypes = ['GP', 'Specialist', 'Medical Centre', 'Allied Health', 'Other'];
                    if (typeof value === 'string' && validTypes.includes(value)) {
                        sanitizedFilters[key] = value;
                    }
                    else {
                        errors.push(`Practice type must be one of: ${validTypes.join(', ')}`);
                    }
                    break;
                case 'minUiRating':
                    const rating = Number(value);
                    if (Number.isInteger(rating) && rating >= 1 && rating <= 5) {
                        sanitizedFilters[key] = rating;
                    }
                    else {
                        errors.push('Minimum UI rating must be an integer between 1 and 5');
                    }
                    break;
                case 'limit':
                    const limit = Number(value);
                    if (Number.isInteger(limit) && limit > 0 && limit <= 1000) {
                        sanitizedFilters[key] = limit;
                    }
                    else {
                        errors.push('Limit must be a positive integer no greater than 1000');
                    }
                    break;
                case 'offset':
                    const offset = Number(value);
                    if (Number.isInteger(offset) && offset >= 0) {
                        sanitizedFilters[key] = offset;
                    }
                    else {
                        errors.push('Offset must be a non-negative integer');
                    }
                    break;
            }
        }
        return {
            isValid: errors.length === 0,
            data: sanitizedFilters,
            errors
        };
    }
    /**
     * Validate ID parameter
     */
    static validateId(id) {
        const errors = [];
        if (!id) {
            errors.push('ID is required');
        }
        else if (typeof id !== 'string') {
            errors.push('ID must be a string');
        }
        else if (id.trim().length === 0) {
            errors.push('ID cannot be empty');
        }
        else if (!this.isValidUUID(id.trim())) {
            errors.push('ID must be a valid UUID');
        }
        return {
            isValid: errors.length === 0,
            data: typeof id === 'string' ? id.trim() : undefined,
            errors
        };
    }
    /**
     * Create validation middleware function for async operations
     */
    static createAsyncValidator(validatorFn) {
        return async (data, options = {}) => {
            try {
                return await validatorFn(data, options);
            }
            catch (error) {
                if (error.code) {
                    throw error;
                }
                const dbError = new Error(`Async validation error: ${error instanceof Error ? error.message : String(error)}`);
                dbError.code = 'ASYNC_VALIDATION_ERROR';
                throw dbError;
            }
        };
    }
    /**
     * Batch validate multiple clinic inputs
     */
    static async validateBatchClinicInputs(dataArray, options = {}) {
        const validItems = [];
        const invalidItems = [];
        for (let i = 0; i < dataArray.length; i++) {
            try {
                const result = await this.validateClinicInput(dataArray[i], { ...options, strict: false });
                if (result.isValid && result.data) {
                    validItems.push({ index: i, data: result.data });
                }
                else {
                    invalidItems.push({ index: i, errors: result.errors });
                }
            }
            catch (error) {
                invalidItems.push({
                    index: i,
                    errors: [`Validation error: ${error instanceof Error ? error.message : String(error)}`]
                });
            }
        }
        return {
            validItems,
            invalidItems,
            allValid: invalidItems.length === 0
        };
    }
    /**
     * Validate partial clinic input data (for updates)
     */
    static validatePartialInputData(data) {
        const errors = [];
        if (!data || typeof data !== 'object') {
            errors.push('Data must be an object');
            return { isValid: false, errors };
        }
        // Validate only the fields that are present
        if (data.name !== undefined) {
            if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
                errors.push('Name must be a non-empty string');
            }
        }
        if (data.address !== undefined) {
            const addressResult = clinicValidator_1.ClinicValidator.validateAddress(data.address);
            errors.push(...addressResult.errors);
        }
        if (data.phone !== undefined) {
            if (!data.phone || typeof data.phone !== 'string') {
                errors.push('Phone is required and must be a string');
            }
            else if (!/^[\+\d\s\-\(\)]+$/.test(data.phone)) {
                errors.push('Phone contains invalid characters');
            }
        }
        if (data.email !== undefined && data.email !== null) {
            if (typeof data.email !== 'string') {
                errors.push('Email must be a string');
            }
            else if (data.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                errors.push('Email must be a valid email address');
            }
        }
        if (data.website !== undefined && data.website !== null) {
            if (typeof data.website !== 'string') {
                errors.push('Website must be a string');
            }
            else if (data.website.length > 0 && !/^https?:\/\/.+/.test(data.website)) {
                errors.push('Website must be a valid URL starting with http:// or https://');
            }
        }
        if (data.uiRating !== undefined) {
            const rating = Number(data.uiRating);
            if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
                errors.push('UI rating must be an integer between 1 and 5');
            }
        }
        if (data.staffCount !== undefined) {
            const count = Number(data.staffCount);
            if (!Number.isInteger(count) || count < 1) {
                errors.push('Staff count must be a positive integer');
            }
        }
        if (data.practiceType !== undefined) {
            const validTypes = ['GP', 'Specialist', 'Medical Centre', 'Allied Health', 'Other'];
            if (!validTypes.includes(data.practiceType)) {
                errors.push(`Practice type must be one of: ${validTypes.join(', ')}`);
            }
        }
        if (data.establishedYear !== undefined && data.establishedYear !== null) {
            const year = Number(data.establishedYear);
            if (!Number.isInteger(year) || year < 1800 || year > new Date().getFullYear()) {
                errors.push('Established year must be a valid year between 1800 and current year');
            }
        }
        if (data.specialties !== undefined) {
            if (!Array.isArray(data.specialties)) {
                errors.push('Specialties must be an array');
            }
            else {
                for (const specialty of data.specialties) {
                    if (!specialty || typeof specialty !== 'string') {
                        errors.push('Each specialty must be a non-empty string');
                        break;
                    }
                }
            }
        }
        if (data.decisionMakers !== undefined) {
            if (!Array.isArray(data.decisionMakers)) {
                errors.push('Decision makers must be an array');
            }
            else {
                for (const dm of data.decisionMakers) {
                    const dmResult = clinicValidator_1.ClinicValidator.validateContactPerson(dm);
                    errors.push(...dmResult.errors);
                }
            }
        }
        if (data.operatingHours !== undefined && data.operatingHours !== null) {
            if (typeof data.operatingHours !== 'object') {
                errors.push('Operating hours must be an object');
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    // Private helper methods
    static applyCustomRules(data, rules) {
        const errors = [];
        for (const [field, validator] of Object.entries(rules)) {
            const value = this.getNestedValue(data, field);
            if (value !== undefined && !validator(value)) {
                errors.push(`Custom validation failed for field: ${field}`);
            }
        }
        return errors;
    }
    static getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    static isValidUUID(str) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
    }
}
exports.ValidationMiddleware = ValidationMiddleware;
// Export convenience functions
exports.validateClinicInput = ValidationMiddleware.validateClinicInput;
exports.validatePartialClinicInput = ValidationMiddleware.validatePartialClinicInput;
exports.validateClinic = ValidationMiddleware.validateClinic;
exports.validateQueryFilters = ValidationMiddleware.validateQueryFilters;
exports.validateId = ValidationMiddleware.validateId;
exports.validateBatchClinicInputs = ValidationMiddleware.validateBatchClinicInputs;
//# sourceMappingURL=validationMiddleware.js.map