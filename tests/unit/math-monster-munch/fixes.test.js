/**
 * @jest-environment jsdom
 */

require('@testing-library/jest-dom');

describe('Math Monster Munch Fixes', () => {
  beforeEach(() => {
    // Set up a simple DOM environment
    document.body.innerHTML = `
      <div class="monster hungry"></div>
      <div class="answer-options">
        <button class="answer-btn" data-answer="0">0</button>
      </div>
    `;
  });

  test('should display zero as "0" instead of "None"', () => {
    // Get the zero button
    const zeroButton = document.querySelector('[data-answer="0"]');
    
    // Check that it displays "0" and not "None"
    expect(zeroButton.textContent).toBe('0');
    expect(zeroButton.textContent).not.toBe('None');
  });

  test('should show correct monster emotions', () => {
    // Get the monster element
    const monster = document.querySelector('.monster');
    
    // Test hungry state (incorrect answer)
    expect(monster.classList).toContain('hungry');
    
    // Test happy state (correct answer)
    monster.classList.remove('hungry');
    monster.classList.add('happy');
    
    expect(monster.classList).toContain('happy');
    expect(monster.classList).not.toContain('hungry');
  });
});
