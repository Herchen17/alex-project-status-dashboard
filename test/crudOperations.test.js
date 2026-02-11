/**
 * CRUD Operations Tests
 * Tests for database connection, seeder, repository, and validation middleware
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Import compiled modules
const { DatabaseConnection, getDatabase } = require('../dist/database/connection');
const { DatabaseSeeder } = require('../dist/database/seeder');
const { ClinicRepository } = require('../dist/database/clinicRepository');
const { ValidationMiddleware } = require('../dist/middleware/validationMiddleware');

// Test database path
const TEST_DB_PATH = path.join(__dirname, '../test_data/test_medical_clinics.db');

// Test data
const validClinicInput = {
  name: 'Gold Coast Family Medical Centre',
  address: {
    street: '123 Main Street',
    suburb: 'Southport',
    state: 'QLD',
    postcode: '4215',
    coordinates: {
      latitude: -27.9654,
      longitude: 153.4057
    }
  },
  phone: '+61 7 5555 0123',
  email: 'info@gcfmc.com.au',
  website: 'https://gcfmc.com.au',
  uiRating: 4,
  staffCount: 12,
  practiceType: 'Medical Centre',
  establishedYear: 2010,
  specialties: ['General Practice', 'Cardiology', 'Dermatology'],
  decisionMakers: [
    {
      name: 'Dr. Sarah Wilson',
      role: 'Practice Manager',
      phone: '+61 7 5555 0124',
      email: 'sarah.wilson@gcfmc.com.au'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Owner',
      phone: '+61 7 5555 0125',
      email: 'michael.chen@gcfmc.com.au'
    }
  ],
  operatingHours: {
    'Monday': '8:00-18:00',
    'Tuesday': '8:00-18:00',
    'Wednesday': '8:00-18:00',
    'Thursday': '8:00-18:00',
    'Friday': '8:00-17:00',
    'Saturday': '9:00-12:00',
    'Sunday': 'Closed'
  },
  notes: 'Bulk billing available. Walk-ins welcome.'
};

const validClinicInput2 = {
  name: 'Surfers Paradise Specialist Clinic',
  address: {
    street: '456 Gold Coast Highway',
    suburb: 'Surfers Paradise',
    state: 'QLD',
    postcode: '4217'
  },
  phone: '+61 7 5555 0200',
  email: 'reception@spsc.com.au',
  website: 'https://spsc.com.au',
  uiRating: 5,
  staffCount: 8,
  practiceType: 'Specialist',
  specialties: ['Orthopaedic Surgery', 'Plastic Surgery'],
  decisionMakers: [
    {
      name: 'Dr. Amanda Roberts',
      role: 'Director',
      email: 'amanda.roberts@spsc.com.au'
    }
  ]
};

// Helper functions
function setupTestDatabase() {
  const testDir = path.dirname(TEST_DB_PATH);
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  // Remove existing test database
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
  
  return getDatabase(TEST_DB_PATH);
}

function cleanupTestDatabase() {
  if (fs.existsSync(TEST_DB_PATH)) {
    try {
      fs.unlinkSync(TEST_DB_PATH);
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

// Test suites
describe('Database Connection Tests', () => {
  test('should create database connection singleton', () => {
    const db1 = getDatabase(TEST_DB_PATH);
    const db2 = getDatabase(TEST_DB_PATH);
    
    assert.strictEqual(db1, db2, 'Should return same instance');
    assert.strictEqual(db1.getDbPath(), TEST_DB_PATH, 'Should have correct path');
  });

  test('should connect to database successfully', async () => {
    const db = setupTestDatabase();
    
    assert.strictEqual(db.isConnected(), false, 'Should not be connected initially');
    
    await db.connect();
    
    assert.strictEqual(db.isConnected(), true, 'Should be connected after connect()');
    
    await db.close();
    cleanupTestDatabase();
  });

  test('should handle database operations', async () => {
    const db = setupTestDatabase();
    await db.connect();

    // Test run operation
    const result = await db.run('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)');
    assert.strictEqual(typeof result.changes, 'number', 'Should return changes count');

    // Test insert and get lastID
    const insertResult = await db.run('INSERT INTO test (name) VALUES (?)', ['test name']);
    assert.strictEqual(typeof insertResult.lastID, 'number', 'Should return lastID');

    // Test get operation
    const row = await db.get('SELECT * FROM test WHERE id = ?', [insertResult.lastID]);
    assert.strictEqual(row.name, 'test name', 'Should retrieve correct data');

    // Test all operation
    const rows = await db.all('SELECT * FROM test');
    assert.strictEqual(rows.length, 1, 'Should retrieve all rows');

    await db.close();
    cleanupTestDatabase();
  });

  test('should handle transactions', async () => {
    const db = setupTestDatabase();
    await db.connect();

    await db.run('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)');

    // Test successful transaction
    const result = await db.transaction(async () => {
      await db.run('INSERT INTO test (name) VALUES (?)', ['test1']);
      await db.run('INSERT INTO test (name) VALUES (?)', ['test2']);
      return 'success';
    });

    assert.strictEqual(result, 'success', 'Transaction should return result');

    const rows = await db.all('SELECT * FROM test');
    assert.strictEqual(rows.length, 2, 'Both inserts should be committed');

    // Test failed transaction
    try {
      await db.transaction(async () => {
        await db.run('INSERT INTO test (name) VALUES (?)', ['test3']);
        throw new Error('Simulated error');
      });
    } catch (error) {
      // Expected to throw
    }

    const rowsAfterRollback = await db.all('SELECT * FROM test');
    assert.strictEqual(rowsAfterRollback.length, 2, 'Failed transaction should be rolled back');

    await db.close();
    cleanupTestDatabase();
  });
});

describe('Database Seeder Tests', () => {
  test('should initialize database schema', async () => {
    const db = setupTestDatabase();
    const seeder = new DatabaseSeeder(db);

    await seeder.initializeSchema();

    // Check if tables exist
    const tables = await db.all(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);

    const tableNames = tables.map(t => t.name);
    const expectedTables = [
      'clinic_specialties',
      'decision_makers',
      'medical_clinics',
      'operating_hours',
      'specialties'
    ];

    for (const expectedTable of expectedTables) {
      assert.ok(tableNames.includes(expectedTable), `Table ${expectedTable} should exist`);
    }

    await db.close();
    cleanupTestDatabase();
  });

  test('should seed specialties data', async () => {
    const db = setupTestDatabase();
    const seeder = new DatabaseSeeder(db);

    await seeder.initializeSchema();
    await seeder.seedSpecialties();

    const specialties = await db.all('SELECT name, category FROM specialties ORDER BY name');
    
    assert.ok(specialties.length > 0, 'Should have seeded specialties');
    assert.ok(specialties.some(s => s.name === 'General Practice'), 'Should include General Practice');
    assert.ok(specialties.some(s => s.name === 'Cardiology'), 'Should include Cardiology');
    assert.ok(specialties.some(s => s.category === 'Primary Care'), 'Should have Primary Care category');

    await db.close();
    cleanupTestDatabase();
  });

  test('should handle complete initialization', async () => {
    const db = setupTestDatabase();
    const seeder = new DatabaseSeeder(db);

    await seeder.initialize();

    // Check tables and data exist
    const tableCount = await db.get('SELECT COUNT(*) as count FROM sqlite_master WHERE type="table"');
    assert.ok(tableCount.count >= 5, 'Should have created all tables');

    const specialtyCount = await db.get('SELECT COUNT(*) as count FROM specialties');
    assert.ok(specialtyCount.count > 20, 'Should have seeded specialties');

    await db.close();
    cleanupTestDatabase();
  });
});

describe('Clinic Repository Tests', () => {
  let db, repository, seeder;

  // Setup for each test
  async function setupRepository() {
    db = setupTestDatabase();
    repository = new ClinicRepository(db);
    seeder = new DatabaseSeeder(db);
    
    await seeder.initialize();
  }

  test('should create a new clinic', async () => {
    await setupRepository();

    const createdClinic = await repository.create(validClinicInput);

    assert.ok(createdClinic.id, 'Should have generated ID');
    assert.strictEqual(createdClinic.name, validClinicInput.name, 'Should have correct name');
    assert.strictEqual(createdClinic.address.suburb, validClinicInput.address.suburb, 'Should have correct suburb');
    assert.strictEqual(createdClinic.specialties.length, validClinicInput.specialties.length, 'Should have correct specialties count');
    assert.strictEqual(createdClinic.decisionMakers.length, validClinicInput.decisionMakers.length, 'Should have correct decision makers count');

    await db.close();
    cleanupTestDatabase();
  });

  test('should find clinic by ID', async () => {
    await setupRepository();

    const createdClinic = await repository.create(validClinicInput);
    const foundClinic = await repository.findById(createdClinic.id);

    assert.ok(foundClinic, 'Should find clinic');
    assert.strictEqual(foundClinic.id, createdClinic.id, 'Should have matching ID');
    assert.strictEqual(foundClinic.name, createdClinic.name, 'Should have matching name');

    // Test non-existent ID
    const notFound = await repository.findById('00000000-0000-0000-0000-000000000000');
    assert.strictEqual(notFound, null, 'Should return null for non-existent ID');

    await db.close();
    cleanupTestDatabase();
  });

  test('should find all clinics with filters', async () => {
    await setupRepository();

    // Create multiple clinics
    const clinic1 = await repository.create(validClinicInput);
    const clinic2 = await repository.create(validClinicInput2);

    // Test find all
    const allClinics = await repository.findAll();
    assert.strictEqual(allClinics.length, 2, 'Should find all clinics');

    // Test suburb filter
    const southportClinics = await repository.findAll({ suburb: 'Southport' });
    assert.strictEqual(southportClinics.length, 1, 'Should filter by suburb');
    assert.strictEqual(southportClinics[0].address.suburb, 'Southport', 'Should have correct suburb');

    // Test practice type filter
    const specialistClinics = await repository.findAll({ practiceType: 'Specialist' });
    assert.strictEqual(specialistClinics.length, 1, 'Should filter by practice type');
    assert.strictEqual(specialistClinics[0].practiceType, 'Specialist', 'Should have correct practice type');

    // Test UI rating filter
    const highRatingClinics = await repository.findAll({ minUiRating: 5 });
    assert.strictEqual(highRatingClinics.length, 1, 'Should filter by UI rating');

    // Test limit
    const limitedClinics = await repository.findAll({ limit: 1 });
    assert.strictEqual(limitedClinics.length, 1, 'Should limit results');

    await db.close();
    cleanupTestDatabase();
  });

  test('should update clinic', async () => {
    await setupRepository();

    const createdClinic = await repository.create(validClinicInput);
    
    const updateData = {
      name: 'Updated Clinic Name',
      uiRating: 5,
      staffCount: 15,
      notes: 'Updated notes'
    };

    const updatedClinic = await repository.update(createdClinic.id, updateData);

    assert.ok(updatedClinic, 'Should return updated clinic');
    assert.strictEqual(updatedClinic.name, updateData.name, 'Should have updated name');
    assert.strictEqual(updatedClinic.uiRating, updateData.uiRating, 'Should have updated UI rating');
    assert.strictEqual(updatedClinic.staffCount, updateData.staffCount, 'Should have updated staff count');
    assert.strictEqual(updatedClinic.notes, updateData.notes, 'Should have updated notes');

    // Test non-existent ID
    const notUpdated = await repository.update('00000000-0000-0000-0000-000000000000', updateData);
    assert.strictEqual(notUpdated, null, 'Should return null for non-existent ID');

    await db.close();
    cleanupTestDatabase();
  });

  test('should delete clinic', async () => {
    await setupRepository();

    const createdClinic = await repository.create(validClinicInput);
    
    // Delete the clinic
    const deleted = await repository.delete(createdClinic.id);
    assert.strictEqual(deleted, true, 'Should return true for successful deletion');

    // Verify it's deleted
    const foundClinic = await repository.findById(createdClinic.id);
    assert.strictEqual(foundClinic, null, 'Should not find deleted clinic');

    // Test deleting non-existent ID
    const notDeleted = await repository.delete('00000000-0000-0000-0000-000000000000');
    assert.strictEqual(notDeleted, false, 'Should return false for non-existent ID');

    await db.close();
    cleanupTestDatabase();
  });

  test('should count clinics', async () => {
    await setupRepository();

    // Initially no clinics
    let count = await repository.count();
    assert.strictEqual(count, 0, 'Should have zero clinics initially');

    // Create clinics
    await repository.create(validClinicInput);
    await repository.create(validClinicInput2);

    // Count all
    count = await repository.count();
    assert.strictEqual(count, 2, 'Should count all clinics');

    // Count with filters
    const specialistCount = await repository.count({ practiceType: 'Specialist' });
    assert.strictEqual(specialistCount, 1, 'Should count filtered clinics');

    await db.close();
    cleanupTestDatabase();
  });
});

describe('Validation Middleware Tests', () => {
  test('should validate clinic input', async () => {
    // Test valid input
    const result = await ValidationMiddleware.validateClinicInput(validClinicInput);
    assert.strictEqual(result.isValid, true, 'Should validate correct input');
    assert.ok(result.data, 'Should return validated data');
    assert.strictEqual(result.errors.length, 0, 'Should have no errors');

    // Test invalid input
    const invalidInput = { ...validClinicInput, name: '' };
    const invalidResult = await ValidationMiddleware.validateClinicInput(invalidInput);
    assert.strictEqual(invalidResult.isValid, false, 'Should not validate invalid input');
    assert.ok(invalidResult.errors.length > 0, 'Should have validation errors');
  });

  test('should validate partial clinic input', async () => {
    const partialUpdate = {
      name: 'Updated Name',
      uiRating: 5
    };

    const result = await ValidationMiddleware.validatePartialClinicInput(partialUpdate);
    assert.strictEqual(result.isValid, true, 'Should validate partial input');
    assert.ok(result.data, 'Should return validated data');

    // Test invalid partial input
    const invalidPartial = {
      uiRating: 10 // Invalid rating
    };

    const invalidResult = await ValidationMiddleware.validatePartialClinicInput(invalidPartial);
    assert.strictEqual(invalidResult.isValid, false, 'Should not validate invalid partial input');
  });

  test('should validate query filters', () => {
    const validFilters = {
      suburb: 'Southport',
      practiceType: 'GP',
      minUiRating: 3,
      limit: 10,
      offset: 0
    };

    const result = ValidationMiddleware.validateQueryFilters(validFilters);
    assert.strictEqual(result.isValid, true, 'Should validate correct filters');
    assert.ok(result.data, 'Should return sanitized data');

    // Test invalid filters
    const invalidFilters = {
      suburb: '',
      practiceType: 'InvalidType',
      minUiRating: 10,
      invalidField: 'test'
    };

    const invalidResult = ValidationMiddleware.validateQueryFilters(invalidFilters);
    assert.strictEqual(invalidResult.isValid, false, 'Should not validate invalid filters');
    assert.ok(invalidResult.errors.length > 0, 'Should have filter errors');
  });

  test('should validate ID parameter', () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';
    
    const result = ValidationMiddleware.validateId(validUUID);
    assert.strictEqual(result.isValid, true, 'Should validate correct UUID');
    assert.strictEqual(result.data, validUUID, 'Should return trimmed UUID');

    // Test invalid IDs
    const invalidResult1 = ValidationMiddleware.validateId('invalid-uuid');
    assert.strictEqual(invalidResult1.isValid, false, 'Should not validate invalid UUID');

    const invalidResult2 = ValidationMiddleware.validateId('');
    assert.strictEqual(invalidResult2.isValid, false, 'Should not validate empty ID');

    const invalidResult3 = ValidationMiddleware.validateId(null);
    assert.strictEqual(invalidResult3.isValid, false, 'Should not validate null ID');
  });

  test('should handle batch validation', async () => {
    const batch = [validClinicInput, validClinicInput2, { invalid: 'data' }];

    const result = await ValidationMiddleware.validateBatchClinicInputs(batch);
    
    assert.strictEqual(result.validItems.length, 2, 'Should have 2 valid items');
    assert.strictEqual(result.invalidItems.length, 1, 'Should have 1 invalid item');
    assert.strictEqual(result.allValid, false, 'Should not be all valid');

    // Check valid items structure
    assert.strictEqual(result.validItems[0].index, 0, 'Should have correct index');
    assert.ok(result.validItems[0].data, 'Should have validated data');

    // Check invalid items structure
    assert.strictEqual(result.invalidItems[0].index, 2, 'Should have correct error index');
    assert.ok(result.invalidItems[0].errors.length > 0, 'Should have errors');
  });

  test('should handle strict validation mode', async () => {
    const invalidInput = { ...validClinicInput, name: '' };

    try {
      await ValidationMiddleware.validateClinicInput(invalidInput, { strict: true });
      assert.fail('Should have thrown error in strict mode');
    } catch (error) {
      assert.ok(error.code, 'Should have error code');
      assert.ok(error.message.includes('Validation failed'), 'Should have validation error message');
    }
  });
});

describe('Integration Tests', () => {
  test('should perform complete CRUD workflow', async () => {
    const db = setupTestDatabase();
    const seeder = new DatabaseSeeder(db);
    const repository = new ClinicRepository(db);

    // Initialize database
    await seeder.initialize();

    // Validate input
    const validationResult = await ValidationMiddleware.validateClinicInput(validClinicInput);
    assert.strictEqual(validationResult.isValid, true, 'Input should be valid');

    // Create clinic
    const createdClinic = await repository.create(validationResult.data);
    assert.ok(createdClinic.id, 'Should create clinic with ID');

    // Read clinic
    const foundClinic = await repository.findById(createdClinic.id);
    assert.ok(foundClinic, 'Should find created clinic');

    // Update clinic
    const updateData = { name: 'Updated Name', uiRating: 5 };
    const updateValidationResult = await ValidationMiddleware.validatePartialClinicInput(updateData);
    assert.strictEqual(updateValidationResult.isValid, true, 'Update data should be valid');

    const updatedClinic = await repository.update(createdClinic.id, updateValidationResult.data);
    assert.strictEqual(updatedClinic.name, 'Updated Name', 'Should update clinic name');

    // Delete clinic
    const deleted = await repository.delete(createdClinic.id);
    assert.strictEqual(deleted, true, 'Should delete clinic');

    // Verify deletion
    const deletedClinic = await repository.findById(createdClinic.id);
    assert.strictEqual(deletedClinic, null, 'Should not find deleted clinic');

    await db.close();
    cleanupTestDatabase();
  });
});

// Run cleanup on process exit
process.on('exit', cleanupTestDatabase);
process.on('SIGINT', () => {
  cleanupTestDatabase();
  process.exit(0);
});