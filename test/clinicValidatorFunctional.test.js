/**
 * Medical Clinic Validator Functional Tests
 * Tests the actual compiled validator functions
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const { ClinicValidator } = require('../dist/validation/clinicValidator.js');

test('Medical Clinic Validator Functional Tests', async (t) => {
  
  await t.test('validateInput with valid clinic data should pass', (t) => {
    const validInput = {
      name: 'Gold Coast Medical Centre',
      address: {
        street: '123 Main Street',
        suburb: 'Surfers Paradise',
        state: 'QLD',
        postcode: '4217',
        coordinates: {
          latitude: -28.0023,
          longitude: 153.4145
        }
      },
      phone: '07 5555 1234',
      email: 'info@gcmedical.com.au',
      website: 'https://www.gcmedical.com.au',
      uiRating: 3,
      staffCount: 15,
      specialties: ['General Practice', 'Family Medicine'],
      decisionMakers: [{
        name: 'Dr. Sarah Johnson',
        role: 'Owner',
        phone: '07 5555 1234',
        email: 'sarah@gcmedical.com.au'
      }],
      practiceType: 'GP',
      establishedYear: 2010,
      operatingHours: {
        'Monday': '8:00-18:00',
        'Tuesday': '8:00-18:00',
        'Wednesday': '8:00-18:00',
        'Thursday': '8:00-18:00',
        'Friday': '8:00-17:00'
      },
      notes: 'Well-established practice with good reputation'
    };

    const result = ClinicValidator.validateInput(validInput);
    assert.strictEqual(result.isValid, true, `Expected validation to pass, but got errors: ${result.errors.join(', ')}`);
    assert.strictEqual(result.errors.length, 0, 'Expected no validation errors');
  });

  await t.test('validateInput with empty name should fail', (t) => {
    const invalidInput = {
      name: '',
      address: {
        street: '123 Main Street',
        suburb: 'Surfers Paradise',
        state: 'QLD',
        postcode: '4217'
      },
      phone: '07 5555 1234',
      uiRating: 3,
      staffCount: 15,
      specialties: ['General Practice'],
      decisionMakers: [{
        name: 'Dr. Sarah Johnson',
        role: 'Owner'
      }],
      practiceType: 'GP'
    };

    const result = ClinicValidator.validateInput(invalidInput);
    assert.strictEqual(result.isValid, false, 'Expected validation to fail');
    assert.ok(result.errors.some(error => error.includes('Name is required')), 'Expected name error');
  });

  await t.test('validateInput with invalid UI rating should fail', (t) => {
    const invalidInput = {
      name: 'Test Clinic',
      address: {
        street: '123 Test St',
        suburb: 'Test Suburb',
        state: 'QLD',
        postcode: '4217'
      },
      phone: '07 5555 1234',
      uiRating: 6, // Invalid - should be 1-5
      staffCount: 15,
      specialties: ['General Practice'],
      decisionMakers: [{
        name: 'Dr. Test',
        role: 'Owner'
      }],
      practiceType: 'GP'
    };

    const result = ClinicValidator.validateInput(invalidInput);
    assert.strictEqual(result.isValid, false, 'Expected validation to fail');
    assert.ok(result.errors.some(error => error.includes('UI rating must be an integer between 1 and 5')), 'Expected UI rating error');
  });

  await t.test('validateInput with invalid postcode should fail', (t) => {
    const invalidInput = {
      name: 'Test Clinic',
      address: {
        street: '123 Test St',
        suburb: 'Test Suburb',
        state: 'QLD',
        postcode: '12345' // Invalid - should be 4 digits
      },
      phone: '07 5555 1234',
      uiRating: 3,
      staffCount: 15,
      specialties: ['General Practice'],
      decisionMakers: [{
        name: 'Dr. Test',
        role: 'Owner'
      }],
      practiceType: 'GP'
    };

    const result = ClinicValidator.validateInput(invalidInput);
    assert.strictEqual(result.isValid, false, 'Expected validation to fail');
    assert.ok(result.errors.some(error => error.includes('postcode must be a 4-digit number')), 'Expected postcode error');
  });

  await t.test('validateInput with empty specialties should fail', (t) => {
    const invalidInput = {
      name: 'Test Clinic',
      address: {
        street: '123 Test St',
        suburb: 'Test Suburb',
        state: 'QLD',
        postcode: '4217'
      },
      phone: '07 5555 1234',
      uiRating: 3,
      staffCount: 15,
      specialties: [], // Empty array should fail
      decisionMakers: [{
        name: 'Dr. Test',
        role: 'Owner'
      }],
      practiceType: 'GP'
    };

    const result = ClinicValidator.validateInput(invalidInput);
    assert.strictEqual(result.isValid, false, 'Expected validation to fail');
    assert.ok(result.errors.some(error => error.includes('At least one specialty is required')), 'Expected specialty error');
  });

  await t.test('validateInput with invalid practice type should fail', (t) => {
    const invalidInput = {
      name: 'Test Clinic',
      address: {
        street: '123 Test St',
        suburb: 'Test Suburb',
        state: 'QLD',
        postcode: '4217'
      },
      phone: '07 5555 1234',
      uiRating: 3,
      staffCount: 15,
      specialties: ['General Practice'],
      decisionMakers: [{
        name: 'Dr. Test',
        role: 'Owner'
      }],
      practiceType: 'Invalid Type'
    };

    const result = ClinicValidator.validateInput(invalidInput);
    assert.strictEqual(result.isValid, false, 'Expected validation to fail');
    assert.ok(result.errors.some(error => error.includes('Practice type must be one of')), 'Expected practice type error');
  });

  await t.test('validateAddress with valid address should pass', (t) => {
    const validAddress = {
      street: '123 Main Street',
      suburb: 'Surfers Paradise',
      state: 'QLD',
      postcode: '4217',
      coordinates: {
        latitude: -28.0023,
        longitude: 153.4145
      }
    };

    const result = ClinicValidator.validateAddress(validAddress);
    assert.strictEqual(result.isValid, true, `Expected validation to pass, but got errors: ${result.errors.join(', ')}`);
  });

  await t.test('validateContactPerson with valid person should pass', (t) => {
    const validPerson = {
      name: 'Dr. Sarah Johnson',
      role: 'Owner',
      phone: '07 5555 1234',
      email: 'sarah@gcmedical.com.au'
    };

    const result = ClinicValidator.validateContactPerson(validPerson);
    assert.strictEqual(result.isValid, true, `Expected validation to pass, but got errors: ${result.errors.join(', ')}`);
  });

  await t.test('validate full clinic with valid data should pass', (t) => {
    const validClinic = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Gold Coast Medical Centre',
      address: {
        street: '123 Main Street',
        suburb: 'Surfers Paradise',
        state: 'QLD',
        postcode: '4217'
      },
      phone: '07 5555 1234',
      email: 'info@gcmedical.com.au',
      website: 'https://www.gcmedical.com.au',
      uiRating: 3,
      staffCount: 15,
      specialties: ['General Practice'],
      decisionMakers: [{
        name: 'Dr. Sarah Johnson',
        role: 'Owner'
      }],
      practiceType: 'GP',
      lastUpdated: new Date(),
      createdAt: new Date()
    };

    const result = ClinicValidator.validate(validClinic);
    assert.strictEqual(result.isValid, true, `Expected validation to pass, but got errors: ${result.errors.join(', ')}`);
  });
});