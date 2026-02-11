const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Mock console methods for cleaner test output
const originalLog = console.log;
const originalError = console.error;

function describe(name, fn) {
    console.log(`\n📋 ${name}`);
    fn();
}

function it(description, fn) {
    try {
        fn();
        console.log(`  ✅ ${description}`);
    } catch (error) {
        console.log(`  ❌ ${description}`);
        console.log(`     Error: ${error.message}`);
        throw error;
    }
}

// Load the schema
const schemaPath = path.join(__dirname, '../projects/project-status-dashboard/data/schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

// Load all project data files
const projectDataDir = path.join(__dirname, '../projects/project-status-dashboard/data/projects');
const expectedFiles = [
    'bitclaw-protocol.json',
    'kanban-dashboard.json', 
    'medical-research.json',
    'token-usage-dashboard.json',
    'ugc-creator-agent.json'
];

// Simple JSON Schema validator function
function validateProject(data, schema) {
    // Check required fields
    for (const field of schema.required) {
        if (!(field in data)) {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    // Check field types and constraints
    for (const [field, value] of Object.entries(data)) {
        const fieldSchema = schema.properties[field];
        if (!fieldSchema) {
            throw new Error(`Unknown field: ${field}`);
        }

        // Type validation
        if (fieldSchema.type === 'string') {
            if (typeof value !== 'string') {
                throw new Error(`Field ${field} must be a string`);
            }
            if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
                throw new Error(`Field ${field} is too short (min ${fieldSchema.minLength})`);
            }
            if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
                throw new Error(`Field ${field} is too long (max ${fieldSchema.maxLength})`);
            }
            if (fieldSchema.pattern && !new RegExp(fieldSchema.pattern).test(value)) {
                throw new Error(`Field ${field} does not match pattern`);
            }
            if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
                throw new Error(`Field ${field} must be one of: ${fieldSchema.enum.join(', ')}`);
            }
            if (fieldSchema.format === 'date-time') {
                if (isNaN(Date.parse(value))) {
                    throw new Error(`Field ${field} must be a valid ISO 8601 datetime`);
                }
            }
            if (fieldSchema.format === 'date') {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || isNaN(Date.parse(value))) {
                    throw new Error(`Field ${field} must be a valid ISO 8601 date`);
                }
            }
            if (fieldSchema.format === 'uri') {
                try {
                    new URL(value);
                } catch {
                    throw new Error(`Field ${field} must be a valid URI`);
                }
            }
        } else if (fieldSchema.type === 'integer') {
            if (!Number.isInteger(value)) {
                throw new Error(`Field ${field} must be an integer`);
            }
            if (fieldSchema.minimum !== undefined && value < fieldSchema.minimum) {
                throw new Error(`Field ${field} must be >= ${fieldSchema.minimum}`);
            }
            if (fieldSchema.maximum !== undefined && value > fieldSchema.maximum) {
                throw new Error(`Field ${field} must be <= ${fieldSchema.maximum}`);
            }
        } else if (fieldSchema.type === 'array') {
            if (!Array.isArray(value)) {
                throw new Error(`Field ${field} must be an array`);
            }
            if (fieldSchema.minItems && value.length < fieldSchema.minItems) {
                throw new Error(`Field ${field} must have at least ${fieldSchema.minItems} items`);
            }
            if (fieldSchema.uniqueItems && new Set(value).size !== value.length) {
                throw new Error(`Field ${field} must have unique items`);
            }
            if (fieldSchema.items) {
                for (const item of value) {
                    if (fieldSchema.items.type === 'string') {
                        if (typeof item !== 'string') {
                            throw new Error(`All items in ${field} must be strings`);
                        }
                        if (fieldSchema.items.minLength && item.length < fieldSchema.items.minLength) {
                            throw new Error(`Items in ${field} are too short`);
                        }
                        if (fieldSchema.items.maxLength && item.length > fieldSchema.items.maxLength) {
                            throw new Error(`Items in ${field} are too long`);
                        }
                    }
                }
            }
        }
    }

    return true;
}

describe('Project Data Files Tests', () => {
    it('should have projects data directory', () => {
        assert.ok(fs.existsSync(projectDataDir), 'Projects data directory should exist');
    });

    it('should contain all expected project files', () => {
        const actualFiles = fs.readdirSync(projectDataDir);
        for (const expectedFile of expectedFiles) {
            assert.ok(actualFiles.includes(expectedFile), `Should contain ${expectedFile}`);
        }
        assert.strictEqual(actualFiles.length, expectedFiles.length, 'Should have exactly 5 project files');
    });

    for (const filename of expectedFiles) {
        const projectId = filename.replace('.json', '');
        
        describe(`${projectId} Data File`, () => {
            let projectData;
            
            it('should be valid JSON', () => {
                const filePath = path.join(projectDataDir, filename);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                projectData = JSON.parse(fileContent);
                assert.ok(projectData, 'Should parse as valid JSON');
            });

            it('should comply with schema structure', () => {
                validateProject(projectData, schema);
            });

            it('should have correct id matching filename', () => {
                assert.strictEqual(projectData.id, projectId, `ID should match filename: ${projectId}`);
            });

            it('should have realistic completion percentage', () => {
                assert.ok(projectData.completion >= 0 && projectData.completion <= 100, 'Completion should be 0-100');
            });

            it('should have recent lastUpdated timestamp', () => {
                const lastUpdated = new Date(projectData.lastUpdated);
                const now = new Date();
                const daysDiff = (now - lastUpdated) / (1000 * 60 * 60 * 24);
                assert.ok(daysDiff < 30, 'lastUpdated should be within last 30 days for realistic tracking');
            });

            it('should have valid status', () => {
                const validStatuses = ['planning', 'active', 'paused', 'complete', 'archived'];
                assert.ok(validStatuses.includes(projectData.status), `Status should be one of: ${validStatuses.join(', ')}`);
            });

            it('should have meaningful title and description', () => {
                assert.ok(projectData.title.length >= 10, 'Title should be descriptive (>=10 chars)');
                assert.ok(projectData.description.length >= 50, 'Description should be detailed (>=50 chars)');
            });

            it('should have at least 3 technologies', () => {
                assert.ok(projectData.technologies.length >= 3, 'Should list at least 3 technologies');
            });

            it('should have valid start date', () => {
                const startDate = new Date(projectData.startDate);
                const now = new Date();
                assert.ok(startDate <= now, 'Start date should not be in the future');
                assert.ok(startDate >= new Date('2025-01-01'), 'Start date should be realistic (2025+)');
            });

            if (projectData.repository) {
                it('should have valid repository URL', () => {
                    const url = new URL(projectData.repository);
                    assert.ok(['github.com', 'gitlab.com', 'bitbucket.org'].some(domain => url.hostname.includes(domain)), 
                        'Repository should be from a known git hosting service');
                });
            }

            if (projectData.demo_url) {
                it('should have valid demo URL', () => {
                    const url = new URL(projectData.demo_url);
                    assert.ok(url.protocol === 'https:', 'Demo URL should use HTTPS');
                });
            }
        });
    }

    describe('Data Quality Tests', () => {
        let allProjectData;

        it('should load all project data successfully', () => {
            allProjectData = expectedFiles.map(filename => {
                const filePath = path.join(projectDataDir, filename);
                return JSON.parse(fs.readFileSync(filePath, 'utf8'));
            });
            assert.strictEqual(allProjectData.length, 5, 'Should load all 5 projects');
        });

        it('should have unique project IDs', () => {
            const ids = allProjectData.map(p => p.id);
            const uniqueIds = new Set(ids);
            assert.strictEqual(ids.length, uniqueIds.size, 'All project IDs should be unique');
        });

        it('should have unique project titles', () => {
            const titles = allProjectData.map(p => p.title);
            const uniqueTitles = new Set(titles);
            assert.strictEqual(titles.length, uniqueTitles.size, 'All project titles should be unique');
        });

        it('should have realistic completion distribution', () => {
            const completions = allProjectData.map(p => p.completion);
            const avgCompletion = completions.reduce((sum, c) => sum + c, 0) / completions.length;
            assert.ok(avgCompletion > 30 && avgCompletion < 90, 'Average completion should be realistic (30-90%)');
        });

        it('should represent diverse project statuses', () => {
            const statuses = allProjectData.map(p => p.status);
            const uniqueStatuses = new Set(statuses);
            assert.ok(uniqueStatuses.size >= 3, 'Should have diverse project statuses (at least 3 different)');
        });

        it('should have diverse technology stacks', () => {
            const allTechs = allProjectData.flatMap(p => p.technologies);
            const uniqueTechs = new Set(allTechs);
            assert.ok(uniqueTechs.size >= 15, 'Should use diverse technologies across projects (15+ unique)');
        });
    });
});

console.log('🧪 Running Project Data Files Tests...\n');

describe('Project Data Files Tests', () => {
    it('should have projects data directory', () => {
        assert.ok(fs.existsSync(projectDataDir), 'Projects data directory should exist');
    });

    it('should contain all expected project files', () => {
        const actualFiles = fs.readdirSync(projectDataDir);
        for (const expectedFile of expectedFiles) {
            assert.ok(actualFiles.includes(expectedFile), `Should contain ${expectedFile}`);
        }
        assert.strictEqual(actualFiles.length, expectedFiles.length, 'Should have exactly 5 project files');
    });

    for (const filename of expectedFiles) {
        const projectId = filename.replace('.json', '');
        
        describe(`${projectId} Data File`, () => {
            let projectData;
            
            it('should be valid JSON', () => {
                const filePath = path.join(projectDataDir, filename);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                projectData = JSON.parse(fileContent);
                assert.ok(projectData, 'Should parse as valid JSON');
            });

            it('should comply with schema structure', () => {
                validateProject(projectData, schema);
            });

            it('should have correct id matching filename', () => {
                assert.strictEqual(projectData.id, projectId, `ID should match filename: ${projectId}`);
            });

            it('should have realistic completion percentage', () => {
                assert.ok(projectData.completion >= 0 && projectData.completion <= 100, 'Completion should be 0-100');
            });

            it('should have recent lastUpdated timestamp', () => {
                const lastUpdated = new Date(projectData.lastUpdated);
                const now = new Date();
                const daysDiff = (now - lastUpdated) / (1000 * 60 * 60 * 24);
                assert.ok(daysDiff < 30, 'lastUpdated should be within last 30 days for realistic tracking');
            });

            it('should have valid status', () => {
                const validStatuses = ['planning', 'active', 'paused', 'complete', 'archived'];
                assert.ok(validStatuses.includes(projectData.status), `Status should be one of: ${validStatuses.join(', ')}`);
            });

            it('should have meaningful title and description', () => {
                assert.ok(projectData.title.length >= 10, 'Title should be descriptive (>=10 chars)');
                assert.ok(projectData.description.length >= 50, 'Description should be detailed (>=50 chars)');
            });

            it('should have at least 3 technologies', () => {
                assert.ok(projectData.technologies.length >= 3, 'Should list at least 3 technologies');
            });

            it('should have valid start date', () => {
                const startDate = new Date(projectData.startDate);
                const now = new Date();
                assert.ok(startDate <= now, 'Start date should not be in the future');
                assert.ok(startDate >= new Date('2025-01-01'), 'Start date should be realistic (2025+)');
            });

            if (projectData.repository) {
                it('should have valid repository URL', () => {
                    const url = new URL(projectData.repository);
                    assert.ok(['github.com', 'gitlab.com', 'bitbucket.org'].some(domain => url.hostname.includes(domain)), 
                        'Repository should be from a known git hosting service');
                });
            }

            if (projectData.demo_url) {
                it('should have valid demo URL', () => {
                    const url = new URL(projectData.demo_url);
                    assert.ok(url.protocol === 'https:', 'Demo URL should use HTTPS');
                });
            }
        });
    }

    describe('Data Quality Tests', () => {
        let allProjectData;

        it('should load all project data successfully', () => {
            allProjectData = expectedFiles.map(filename => {
                const filePath = path.join(projectDataDir, filename);
                return JSON.parse(fs.readFileSync(filePath, 'utf8'));
            });
            assert.strictEqual(allProjectData.length, 5, 'Should load all 5 projects');
        });

        it('should have unique project IDs', () => {
            const ids = allProjectData.map(p => p.id);
            const uniqueIds = new Set(ids);
            assert.strictEqual(ids.length, uniqueIds.size, 'All project IDs should be unique');
        });

        it('should have unique project titles', () => {
            const titles = allProjectData.map(p => p.title);
            const uniqueTitles = new Set(titles);
            assert.strictEqual(titles.length, uniqueTitles.size, 'All project titles should be unique');
        });

        it('should have realistic completion distribution', () => {
            const completions = allProjectData.map(p => p.completion);
            const avgCompletion = completions.reduce((sum, c) => sum + c, 0) / completions.length;
            assert.ok(avgCompletion > 30 && avgCompletion < 90, 'Average completion should be realistic (30-90%)');
        });

        it('should represent diverse project statuses', () => {
            const statuses = allProjectData.map(p => p.status);
            const uniqueStatuses = new Set(statuses);
            assert.ok(uniqueStatuses.size >= 3, 'Should have diverse project statuses (at least 3 different)');
        });

        it('should have diverse technology stacks', () => {
            const allTechs = allProjectData.flatMap(p => p.technologies);
            const uniqueTechs = new Set(allTechs);
            assert.ok(uniqueTechs.size >= 15, 'Should use diverse technologies across projects (15+ unique)');
        });
    });
});

console.log('\n✨ All tests completed!');