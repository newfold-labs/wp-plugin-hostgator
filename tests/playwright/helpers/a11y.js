/**
 * Accessibility Testing Helpers
 * 
 * Simplified utilities for testing accessibility using @axe-core/playwright.
 * Focuses on WCAG AA compliance with flexible configuration.
 */

import AxeBuilder from '@axe-core/playwright';

/**
 * Check accessibility for a specific element and its children
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - CSS selector for the area to test (required)
 * @param {Object} options - Configuration options
 * @param {string[]} options.exclude - Array of selectors to exclude from testing
 * @param {string[]} options.disabledRules - Array of rule names to disable
 * @returns {Promise<Object>} Accessibility test results
 */
async function checkA11y(page, selector, options = {}) {
  if (!selector) {
    throw new Error('Selector is required for accessibility testing');
  }

  const count = await page.locator(selector).count();
  if (count === 0) {
    throw new Error(`Selector ${selector} not found`);
  }

  const axeBuilder = new AxeBuilder({ page });
  
  // Focus on the specified element
  axeBuilder.include(selector);
  
  // Exclude specified areas if provided
  if (options.exclude && options.exclude.length > 0) {
    axeBuilder.exclude(options.exclude);
  }
  
  // Disable specified rules if provided
  if (options.disabledRules && options.disabledRules.length > 0) {
    axeBuilder.disableRules(options.disabledRules);
  }
  
  // Default to WCAG AA compliance (can be overridden with options.tags)
  if (!options.tags) {
    axeBuilder.withTags(['wcag2aa', 'wcag21aa']);
  } else if (options.tags.length > 0) {
    axeBuilder.withTags(options.tags);
  }
  // If options.tags is an empty array, don't call withTags (test all rules)
  
  const results = await axeBuilder.analyze();
  
  if (results.violations.length > 0) {
    const violationMessages = results.violations.map((violation, index) => {
      const nodes = violation.nodes.map((node, nodeIndex) => {
        const target = node.target.join(', ');
        const html = node.html.replace(/\s+/g, ' ').trim(); // Clean up whitespace
        const impact = node.impact ? ` (Impact: ${node.impact})` : '';
        
        return `    ${nodeIndex + 1}. ${html}\n       Selector: ${target}${impact}`;
      }).join('\n');
      
      const helpUrl = violation.helpUrl ? `\n   Help: ${violation.helpUrl}` : '';
      const tags = violation.tags ? `\n   WCAG Tags: ${violation.tags.join(', ')}` : '';
      
      return `  ${index + 1}. ${violation.id}: ${violation.description}
   Impact: ${violation.impact || 'Unknown'}
   Help: ${violation.help}${helpUrl}${tags}
   
   Violating Elements:
${nodes}`;
    }).join('\n\n');
    
    const summary = `Found ${results.violations.length} accessibility violation${results.violations.length === 1 ? '' : 's'} in ${selector}`;
    const totalNodes = results.violations.reduce((sum, violation) => sum + violation.nodes.length, 0);
    const nodeSummary = `Total elements with violations: ${totalNodes}`;
    
    throw new Error(`${summary}\n${nodeSummary}\n\n${violationMessages}`);
  }

  return results;
}

/**
 * Check only color contrast issues for a specific element
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - CSS selector for the area to test (required)
 * @param {Object} options - Configuration options
 * @param {string[]} options.exclude - Array of selectors to exclude from testing
 * @returns {Promise<Object>} Color contrast test results
 */
async function checkColorContrast(page, selector, options = {}) {
  if (!selector) {
    throw new Error('Selector is required for color contrast testing');
  }

  const axeBuilder = new AxeBuilder({ page });
  
  // Focus on the specified element
  axeBuilder.include(selector);
  
  // Exclude specified areas if provided
  if (options.exclude && options.exclude.length > 0) {
    axeBuilder.exclude(options.exclude);
  }
  
  // Only run color-contrast rule
  axeBuilder.withRules(['color-contrast']);
  
  const results = await axeBuilder.analyze();
  
  if (results.violations.length > 0) {
    const violationMessages = results.violations.map((violation, index) => {
      const nodes = violation.nodes.map((node, nodeIndex) => {
        const target = node.target.join(', ');
        const html = node.html.replace(/\s+/g, ' ').trim(); // Clean up whitespace
        const impact = node.impact ? ` (Impact: ${node.impact})` : '';
        
        return `    ${nodeIndex + 1}. ${html}\n       Selector: ${target}${impact}`;
      }).join('\n');
      
      const helpUrl = violation.helpUrl ? `\n   Help: ${violation.helpUrl}` : '';
      const tags = violation.tags ? `\n   WCAG Tags: ${violation.tags.join(', ')}` : '';
      
      return `  ${index + 1}. ${violation.id}: ${violation.description}
   Impact: ${violation.impact || 'Unknown'}
   Help: ${violation.help}${helpUrl}${tags}
   
   Violating Elements:
${nodes}`;
    }).join('\n\n');
    
    const summary = `Found ${results.violations.length} color contrast violation${results.violations.length === 1 ? '' : 's'} in ${selector}`;
    const totalNodes = results.violations.reduce((sum, violation) => sum + violation.nodes.length, 0);
    const nodeSummary = `Total elements with violations: ${totalNodes}`;
    
    throw new Error(`${summary}\n${nodeSummary}\n\n${violationMessages}`);
  }

  return results;
}

export default {
  checkA11y,
  checkColorContrast,
};
