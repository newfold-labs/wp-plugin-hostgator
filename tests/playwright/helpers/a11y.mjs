/**
 * Accessibility Testing Helpers
 *
 * Simplified utilities for testing accessibility using @axe-core/playwright.
 */

import AxeBuilder from '@axe-core/playwright';

async function checkA11y(page, selector, options = {}) {
  if (!selector) {
    throw new Error('Selector is required for accessibility testing');
  }

  const count = await page.locator(selector).count();
  if (count === 0) {
    throw new Error(`Selector ${selector} not found`);
  }

  const axeBuilder = new AxeBuilder({ page });
  axeBuilder.include(selector);

  if (options.exclude && options.exclude.length > 0) {
    axeBuilder.exclude(options.exclude);
  }
  if (options.disabledRules && options.disabledRules.length > 0) {
    axeBuilder.disableRules(options.disabledRules);
  }
  if (!options.tags) {
    axeBuilder.withTags(['wcag2aa', 'wcag21aa']);
  } else if (options.tags.length > 0) {
    axeBuilder.withTags(options.tags);
  }

  const results = await axeBuilder.analyze();

  if (results.violations.length > 0) {
    const violationMessages = results.violations.map((violation, index) => {
      const nodes = violation.nodes.map((node, nodeIndex) => {
        const target = node.target.join(', ');
        const html = node.html.replace(/\s+/g, ' ').trim();
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
    throw new Error(`${summary}\nTotal elements with violations: ${totalNodes}\n\n${violationMessages}`);
  }

  return results;
}

async function checkColorContrast(page, selector, options = {}) {
  if (!selector) {
    throw new Error('Selector is required for color contrast testing');
  }
  const axeBuilder = new AxeBuilder({ page });
  axeBuilder.include(selector);
  if (options.exclude && options.exclude.length > 0) {
    axeBuilder.exclude(options.exclude);
  }
  axeBuilder.withRules(['color-contrast']);
  const results = await axeBuilder.analyze();
  if (results.violations.length > 0) {
    const violationMessages = results.violations.map((v, i) =>
      `  ${i + 1}. ${v.id}: ${v.description}`
    ).join('\n');
    throw new Error(`Found ${results.violations.length} color contrast violation(s) in ${selector}\n\n${violationMessages}`);
  }
  return results;
}

export default {
  checkA11y,
  checkColorContrast,
};
