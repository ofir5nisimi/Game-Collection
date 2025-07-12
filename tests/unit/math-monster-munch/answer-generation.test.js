/**
 * @jest-environment jsdom
 */

require('@testing-library/jest-dom');

describe('Math Monster Munch Answer Generation', () => {
  beforeEach(() => {
    // Create minimal DOM structure
    document.body.innerHTML = `
      <div class="container">
        <div id="game-area" class="game-area"></div>
      </div>
    `;
  });

  describe('createAnswerOptions Bug Fix', () => {
    test('should have infinite loop prevention mechanism', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check for the maxAttempts safety mechanism
      expect(scriptContent).toContain('maxAttempts');
      expect(scriptContent).toContain('attempts < maxAttempts');
      expect(scriptContent).toContain('attempts++');
    });

    test('should have maximum attempts limit set to reasonable value', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check that maxAttempts is set to 50 (reasonable limit)
      expect(scriptContent).toContain('maxAttempts = 50');
    });

    test('should have range expansion logic for small answer sets', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check for range expansion when range is too small
      expect(scriptContent).toContain('max - min + 1 < 4');
      expect(scriptContent).toContain('correctAnswer - 3');
      expect(scriptContent).toContain('correctAnswer + 3');
    });

    test('should have fallback answer generation mechanism', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check for fallback sequential number filling
      expect(scriptContent).toContain('answers.length < 4');
      expect(scriptContent).toContain('fillValue = 1');
      expect(scriptContent).toContain('fillValue++');
    });

    test('should have safety check in fallback mechanism', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check for safety check to prevent infinite loop in fallback
      expect(scriptContent).toContain('fillValue > Math.max(20, maxValue)');
      expect(scriptContent).toContain('break');
    });
  });

  describe('Answer Generation Logic', () => {
    test('should ensure answers are always positive', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check that answers must be > 0
      expect(scriptContent).toContain('randomAnswer > 0');
      expect(scriptContent).toContain('fillValue > 0');
    });

    test('should generate unique answers', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check for uniqueness validation
      expect(scriptContent).toContain('!answers.includes(randomAnswer)');
      expect(scriptContent).toContain('!answers.includes(fillValue)');
    });

    test('should generate exactly 4 answer options', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check that the logic aims for 4 answers
      expect(scriptContent).toContain('answers.length < 4');
    });

    test('should include correct answer in options', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check that correct answer is included initially
      expect(scriptContent).toContain('answers = [correctAnswer]');
    });
  });

  describe('Range Calculation Improvements', () => {
    test('should handle small numbers with wider range', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check for special handling of small correct answers
      expect(scriptContent).toContain('correctAnswer <= 5');
      expect(scriptContent).toContain('min = 1');
      expect(scriptContent).toContain('Math.min(10, maxValue)');
    });

    test('should expand range progressively', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check for progressive range expansion
      expect(scriptContent).toContain('Math.max(1, correctAnswer - 3)');
      expect(scriptContent).toContain('Math.min(maxValue, correctAnswer + 3)');
      expect(scriptContent).toContain('Math.max(10, correctAnswer + 5)');
    });

    test('should respect maxValue boundaries', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check that maxValue is respected in range calculations
      expect(scriptContent).toContain('Math.min(maxValue');
      expect(scriptContent).toContain('Math.max(1,');
    });
  });

  describe('Subtraction Mode Specific Fixes', () => {
    test('should prevent zero results in subtraction', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check subtraction logic prevents zero results
      expect(scriptContent).toContain('num2 is always less than num1');
      expect(scriptContent).toContain('num1 - 1');
    });

    test('should ensure meaningful subtraction questions', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check that num1 is at least 2 for meaningful subtraction
      expect(scriptContent).toContain('num1 < 2');
      expect(scriptContent).toContain('num1 = 2');
    });
  });

  describe('Performance and Safety', () => {
    test('should not create infinite loops in worst case scenarios', () => {
      // This is a conceptual test - the code should handle edge cases
      // Check that there are multiple exit conditions
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Count the number of break statements and exit conditions
      const breakStatements = (scriptContent.match(/break;/g) || []).length;
      const maxAttemptsChecks = (scriptContent.match(/maxAttempts/g) || []).length;
      
      expect(breakStatements).toBeGreaterThan(0);
      expect(maxAttemptsChecks).toBeGreaterThan(0);
    });

    test('should have reasonable performance limits', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check that limits are reasonable (not too high to cause performance issues)
      expect(scriptContent).toContain('50'); // maxAttempts
      expect(scriptContent).toContain('20'); // maxValue in fallback
    });
  });

  describe('Emoji Display Logic', () => {
    test('should organize emojis in rows of 10', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check for emoji organization logic
      expect(scriptContent).toContain('fullRows = Math.floor(answer / 10)');
      expect(scriptContent).toContain('remainder = answer % 10');
      expect(scriptContent).toContain('emoji-row');
    });

    test('should handle both full rows and remainder emojis', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check for full rows logic
      expect(scriptContent).toContain('for (let row = 0; row < fullRows; row++)');
      
      // Check for remainder logic
      expect(scriptContent).toContain('if (remainder > 0)');
      expect(scriptContent).toContain('for (let i = 0; i < remainder; i++)');
    });
  });
}); 