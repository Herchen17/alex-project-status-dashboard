/**
 * Validation Middleware
 * Provides validation middleware functions for medical clinic operations
 */
import { MedicalClinic, MedicalClinicInput } from '../types/MedicalClinic';
export interface ValidationOptions {
    strict?: boolean;
    skipFields?: string[];
    customRules?: {
        [field: string]: (value: any) => boolean;
    };
}
export declare class ValidationMiddleware {
    /**
     * Validate medical clinic input data
     */
    static validateClinicInput(data: unknown, options?: ValidationOptions): Promise<{
        isValid: boolean;
        data?: MedicalClinicInput;
        errors: string[];
    }>;
    /**
     * Validate partial clinic data for updates
     */
    static validatePartialClinicInput(data: unknown, options?: ValidationOptions): Promise<{
        isValid: boolean;
        data?: Partial<MedicalClinicInput>;
        errors: string[];
    }>;
    /**
     * Validate complete clinic data
     */
    static validateClinic(data: unknown, options?: ValidationOptions): Promise<{
        isValid: boolean;
        data?: MedicalClinic;
        errors: string[];
    }>;
    /**
     * Validate query filters for database operations
     */
    static validateQueryFilters(filters: unknown): {
        isValid: boolean;
        data?: any;
        errors: string[];
    };
    /**
     * Validate ID parameter
     */
    static validateId(id: unknown): {
        isValid: boolean;
        data?: string;
        errors: string[];
    };
    /**
     * Create validation middleware function for async operations
     */
    static createAsyncValidator<T>(validatorFn: (data: unknown, options?: ValidationOptions) => Promise<{
        isValid: boolean;
        data?: T;
        errors: string[];
    }>): (data: unknown, options?: ValidationOptions) => Promise<{
        isValid: boolean;
        data?: T;
        errors: string[];
    }>;
    /**
     * Batch validate multiple clinic inputs
     */
    static validateBatchClinicInputs(dataArray: unknown[], options?: ValidationOptions): Promise<{
        validItems: {
            index: number;
            data: MedicalClinicInput;
        }[];
        invalidItems: {
            index: number;
            errors: string[];
        }[];
        allValid: boolean;
    }>;
    /**
     * Validate partial clinic input data (for updates)
     */
    private static validatePartialInputData;
    private static applyCustomRules;
    private static getNestedValue;
    private static isValidUUID;
}
export declare const validateClinicInput: typeof ValidationMiddleware.validateClinicInput;
export declare const validatePartialClinicInput: typeof ValidationMiddleware.validatePartialClinicInput;
export declare const validateClinic: typeof ValidationMiddleware.validateClinic;
export declare const validateQueryFilters: typeof ValidationMiddleware.validateQueryFilters;
export declare const validateId: typeof ValidationMiddleware.validateId;
export declare const validateBatchClinicInputs: typeof ValidationMiddleware.validateBatchClinicInputs;
