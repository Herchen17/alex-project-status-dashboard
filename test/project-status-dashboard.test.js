const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');

describe('Project Status Dashboard', function() {
    let dom, document, window;
    
    before(function() {
        const htmlPath = path.join(__dirname, '../projects/project-status-dashboard/index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        dom = new JSDOM(htmlContent, { runScripts: "dangerously" });
        document = dom.window.document;
        window = dom.window;
        global.document = document;
        global.window = window;
    });
    
    it('should have correct HTML structure', function() {
        const title = document.querySelector('title');
        assert(title.textContent.includes('Project Status Dashboard'));
        
        const header = document.querySelector('.header h1');
        assert(header.textContent.includes('Project Status Dashboard'));
        
        const description = document.querySelector('.header p');
        assert(description.textContent.includes('Track completion progress'));
    });
    
    it('should have loading state initially visible', function() {
        const loadingElement = document.getElementById('loading');
        const projectGrid = document.getElementById('project-grid');
        
        assert(loadingElement !== null);
        assert(projectGrid !== null);
        
        // Grid should be hidden initially (style="display: none;")
        assert.strictEqual(projectGrid.style.display, 'none');
    });
    
    it('should have project grid container', function() {
        const projectGrid = document.getElementById('project-grid');
        assert(projectGrid.classList.contains('project-grid'));
    });
    
    it('should have loading spinner and text', function() {
        const loadingSpinner = document.querySelector('.loading-spinner');
        const loadingText = document.querySelector('#loading p');
        
        assert(loadingSpinner !== null);
        assert(loadingText !== null);
        assert(loadingText.textContent.includes('Loading project data'));
    });
    
    it('should have sample project data defined', function() {
        // Check if the script section contains project data
        const scripts = document.querySelectorAll('script');
        let hasProjectData = false;
        
        scripts.forEach(script => {
            if (script.textContent.includes('projectData')) {
                hasProjectData = true;
            }
        });
        
        assert(hasProjectData);
    });
    
    it('should have responsive CSS classes', function() {
        // Check that key CSS classes exist in the document
        const style = document.querySelector('style');
        const cssContent = style.textContent;
        
        assert(cssContent.includes('.project-card'));
        assert(cssContent.includes('.progress-bar'));
        assert(cssContent.includes('.progress-fill'));
        assert(cssContent.includes('@media (max-width: 768px)'));
    });
});

// Basic validation that the file exists and is readable
describe('Project Structure Validation', function() {
    it('should have README.md file', function() {
        const readmePath = path.join(__dirname, '../projects/project-status-dashboard/README.md');
        assert(fs.existsSync(readmePath));
        
        const content = fs.readFileSync(readmePath, 'utf8');
        assert(content.includes('Project Status Dashboard'));
        assert(content.includes('completion percentages'));
    });
    
    it('should have proper directory structure', function() {
        const projectDir = path.join(__dirname, '../projects/project-status-dashboard');
        assert(fs.existsSync(projectDir));
        
        const indexPath = path.join(projectDir, 'index.html');
        assert(fs.existsSync(indexPath));
        
        const readmePath = path.join(projectDir, 'README.md');
        assert(fs.existsSync(readmePath));
    });
    
    it('should follow established patterns from existing projects', function() {
        const htmlPath = path.join(__dirname, '../projects/project-status-dashboard/index.html');
        const content = fs.readFileSync(htmlPath, 'utf8');
        
        // Check for standard patterns used in other projects
        assert(content.includes('<!DOCTYPE html>'));
        assert(content.includes('-apple-system, BlinkMacSystemFont'));
        assert(content.includes('#fafbfc')); // Background color pattern
        assert(content.includes('#172b4d')); // Text color pattern
        assert(content.includes('.header'));
    });
});