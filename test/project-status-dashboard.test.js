const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { test, describe } = require('node:test');

// Project Status Dashboard Tests - converted to Node.js test runner syntax

test('Project Status Dashboard - HTML structure validation', (t) => {
    const htmlPath = path.join(__dirname, '../projects/project-status-dashboard/index.html');
    
    // Check that the HTML file exists
    assert(fs.existsSync(htmlPath), 'Dashboard HTML file should exist');
    
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Basic structure checks
    assert(htmlContent.includes('Project Status Dashboard'), 'HTML should contain project title');
    assert(htmlContent.includes('<!DOCTYPE html>'), 'HTML should have proper doctype');
    assert(htmlContent.includes('.header'), 'HTML should have header styles');
});

test('Project Status Dashboard - README validation', (t) => {
    const readmePath = path.join(__dirname, '../projects/project-status-dashboard/README.md');
    
    assert(fs.existsSync(readmePath), 'README.md file should exist');
    
    const content = fs.readFileSync(readmePath, 'utf8');
    assert(content.includes('Project Status Dashboard'), 'README should contain project name');
    assert(content.includes('completion percentages'), 'README should mention completion percentages');
});

test('Project Status Dashboard - directory structure', (t) => {
    const projectDir = path.join(__dirname, '../projects/project-status-dashboard');
    
    assert(fs.existsSync(projectDir), 'Project directory should exist');
    
    const indexPath = path.join(projectDir, 'index.html');
    assert(fs.existsSync(indexPath), 'index.html should exist');
    
    const readmePath = path.join(projectDir, 'README.md');
    assert(fs.existsSync(readmePath), 'README.md should exist');
});

test('Project Status Dashboard - CSS patterns', (t) => {
    const htmlPath = path.join(__dirname, '../projects/project-status-dashboard/index.html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    
    // Check for standard patterns
    assert(content.includes('-apple-system, BlinkMacSystemFont'), 'Should use system font stack');
    assert(content.includes('#fafbfc'), 'Should use standard background color');
    assert(content.includes('#172b4d'), 'Should use standard text color');
});