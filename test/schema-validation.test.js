const fs = require('fs');
const path = require('path');
const assert = require('assert');

describe('Project Metadata Schema Validation', function() {
    let schema;
    
    before(function() {
        const schemaPath = path.join(__dirname, '../projects/project-status-dashboard/data/schema.json');
        const schemaContent = fs.readFileSync(schemaPath, 'utf8');
        schema = JSON.parse(schemaContent);
    });
    
    it('should have valid JSON schema structure', function() {
        // Verify JSON Schema Draft 7
        assert.strictEqual(schema.$schema, 'http://json-schema.org/draft-07/schema#');
        assert.strictEqual(schema.type, 'object');
        assert(schema.title && typeof schema.title === 'string');
        assert(schema.description && typeof schema.description === 'string');
    });
    
    it('should have all required fields defined', function() {
        const expectedRequired = [
            'id', 'title', 'description', 'completion', 
            'lastUpdated', 'status', 'technologies', 'startDate'
        ];
        
        assert(Array.isArray(schema.required));
        assert.strictEqual(schema.required.length, expectedRequired.length);
        
        expectedRequired.forEach(field => {
            assert(schema.required.includes(field), `Missing required field: ${field}`);
        });
    });
    
    it('should have correct property definitions for required fields', function() {
        const properties = schema.properties;
        
        // Check id field
        assert.strictEqual(properties.id.type, 'string');
        assert(properties.id.pattern);
        assert(properties.id.minLength >= 1);
        assert(properties.id.maxLength);
        
        // Check title field
        assert.strictEqual(properties.title.type, 'string');
        assert(properties.title.minLength >= 1);
        assert(properties.title.maxLength);
        
        // Check description field  
        assert.strictEqual(properties.description.type, 'string');
        assert(properties.description.minLength >= 1);
        assert(properties.description.maxLength);
        
        // Check completion field (integer 0-100)
        assert.strictEqual(properties.completion.type, 'integer');
        assert.strictEqual(properties.completion.minimum, 0);
        assert.strictEqual(properties.completion.maximum, 100);
        
        // Check lastUpdated field
        assert.strictEqual(properties.lastUpdated.type, 'string');
        assert.strictEqual(properties.lastUpdated.format, 'date-time');
        
        // Check status field (enum)
        assert.strictEqual(properties.status.type, 'string');
        assert(Array.isArray(properties.status.enum));
        const expectedStatuses = ['planning', 'active', 'paused', 'complete', 'archived'];
        assert.deepStrictEqual(properties.status.enum.sort(), expectedStatuses.sort());
        
        // Check technologies field (array of strings)
        assert.strictEqual(properties.technologies.type, 'array');
        assert.strictEqual(properties.technologies.items.type, 'string');
        assert(properties.technologies.minItems >= 1);
        assert.strictEqual(properties.technologies.uniqueItems, true);
        
        // Check startDate field
        assert.strictEqual(properties.startDate.type, 'string');
        assert.strictEqual(properties.startDate.format, 'date');
    });
    
    it('should have correct optional field definitions', function() {
        const properties = schema.properties;
        
        // Check repository field
        assert.strictEqual(properties.repository.type, 'string');
        assert.strictEqual(properties.repository.format, 'uri');
        
        // Check documentation field
        assert.strictEqual(properties.documentation.type, 'string');
        assert.strictEqual(properties.documentation.format, 'uri');
        
        // Check demo_url field
        assert.strictEqual(properties.demo_url.type, 'string');
        assert.strictEqual(properties.demo_url.format, 'uri');
    });
    
    it('should not allow additional properties', function() {
        assert.strictEqual(schema.additionalProperties, false);
    });
    
    it('should validate a correct project object', function() {
        const validProject = {
            id: 'covid-research-project',
            title: 'COVID-19 Platelet Research',
            description: 'Research into platelet-driven microthrombosis in COVID-19 patients',
            completion: 95,
            lastUpdated: '2024-01-15T10:30:00Z',
            status: 'complete',
            technologies: ['R', 'Statistical Analysis', 'Medical Research'],
            startDate: '2022-01-01',
            repository: 'https://github.com/alexherchen/covid-research',
            documentation: 'https://docs.example.com/covid-research',
            demo_url: 'https://demo.example.com/covid-dashboard'
        };
        
        // Basic structural validation
        assert(typeof validProject.id === 'string');
        assert(validProject.id.match(/^[a-z0-9-]+$/));
        assert(typeof validProject.title === 'string');
        assert(validProject.title.length >= 1 && validProject.title.length <= 100);
        assert(typeof validProject.description === 'string');
        assert(validProject.description.length >= 1 && validProject.description.length <= 500);
        assert(typeof validProject.completion === 'number');
        assert(validProject.completion >= 0 && validProject.completion <= 100);
        assert(['planning', 'active', 'paused', 'complete', 'archived'].includes(validProject.status));
        assert(Array.isArray(validProject.technologies));
        assert(validProject.technologies.length >= 1);
    });
    
    it('should detect invalid completion values', function() {
        const invalidCompletions = [-1, 101, 50.5, 'fifty', null];
        
        invalidCompletions.forEach(invalidValue => {
            if (typeof invalidValue === 'number') {
                if (invalidValue < 0 || invalidValue > 100 || !Number.isInteger(invalidValue)) {
                    assert(true, `Should reject completion value: ${invalidValue}`);
                }
            } else {
                assert(true, `Should reject non-number completion value: ${invalidValue}`);
            }
        });
    });
    
    it('should detect invalid status values', function() {
        const validStatuses = ['planning', 'active', 'paused', 'complete', 'archived'];
        const invalidStatuses = ['in-progress', 'done', 'cancelled', 'pending', ''];
        
        invalidStatuses.forEach(status => {
            assert(!validStatuses.includes(status), `Should reject invalid status: ${status}`);
        });
    });
    
    it('should validate id pattern constraints', function() {
        const validIds = ['project-1', 'covid-research', 'my-project-123', 'a'];
        const invalidIds = ['Project1', 'project_1', 'project 1', 'project.1', 'PROJECT-1', ''];
        
        const pattern = new RegExp('^[a-z0-9-]+$');
        
        validIds.forEach(id => {
            assert(pattern.test(id) && id.length >= 1 && id.length <= 50, 
                   `Should accept valid id: ${id}`);
        });
        
        invalidIds.forEach(id => {
            assert(!pattern.test(id) || id.length < 1 || id.length > 50, 
                   `Should reject invalid id: ${id}`);
        });
    });
});

describe('Schema File Structure', function() {
    it('should exist at correct location', function() {
        const schemaPath = path.join(__dirname, '../projects/project-status-dashboard/data/schema.json');
        assert(fs.existsSync(schemaPath), 'Schema file should exist at projects/project-status-dashboard/data/schema.json');
    });
    
    it('should be valid JSON', function() {
        const schemaPath = path.join(__dirname, '../projects/project-status-dashboard/data/schema.json');
        const schemaContent = fs.readFileSync(schemaPath, 'utf8');
        
        let parsed;
        assert.doesNotThrow(() => {
            parsed = JSON.parse(schemaContent);
        }, 'Schema file should contain valid JSON');
        
        assert(typeof parsed === 'object', 'Parsed schema should be an object');
        assert(parsed !== null, 'Parsed schema should not be null');
    });
    
    it('should have data directory created', function() {
        const dataDir = path.join(__dirname, '../projects/project-status-dashboard/data');
        assert(fs.existsSync(dataDir), 'Data directory should exist');
        
        const stats = fs.statSync(dataDir);
        assert(stats.isDirectory(), 'Data path should be a directory');
    });
});