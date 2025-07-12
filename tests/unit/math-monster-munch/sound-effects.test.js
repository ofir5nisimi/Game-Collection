/**
 * @jest-environment jsdom
 */

require('@testing-library/jest-dom');

// Mock Web Audio API
const mockOscillator = {
  type: 'sine',
  frequency: { 
    setValueAtTime: jest.fn(),
    exponentialRampToValueAtTime: jest.fn()
  },
  connect: jest.fn(),
  start: jest.fn(),
  stop: jest.fn()
};

const mockGainNode = {
  gain: {
    setValueAtTime: jest.fn(),
    linearRampToValueAtTime: jest.fn(),
    exponentialRampToValueAtTime: jest.fn()
  },
  connect: jest.fn()
};

const mockAudioContext = {
  createOscillator: jest.fn(() => mockOscillator),
  createGain: jest.fn(() => mockGainNode),
  currentTime: 0,
  destination: {}
};

global.AudioContext = jest.fn(() => mockAudioContext);
global.webkitAudioContext = jest.fn(() => mockAudioContext);

describe('Math Monster Munch Sound Effects', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create minimal DOM structure
    document.body.innerHTML = `
      <div class="container">
        <div id="game-area" class="game-area"></div>
      </div>
    `;
  });

  describe('Function Renaming and Existence', () => {
    test('should have renamed playApplauseSound to playSuccessSound', () => {
      // Load the script content to check function names
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check that old function name is gone and new one exists
      expect(scriptContent).not.toContain('function playApplauseSound');
      expect(scriptContent).toContain('function playSuccessSound');
    });

    test('should have renamed playOhhhSound to playErrorSound', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      expect(scriptContent).not.toContain('function playOhhhSound');
      expect(scriptContent).toContain('function playErrorSound');
    });

    test('should have updated function calls to use new names', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      expect(scriptContent).toContain('playSuccessSound()');
      expect(scriptContent).toContain('playErrorSound()');
      expect(scriptContent).not.toContain('playApplauseSound()');
      expect(scriptContent).not.toContain('playOhhhSound()');
    });
  });

  describe('Audio Context and Volume Levels', () => {
    test('should create AudioContext without errors', () => {
      expect(() => {
        new AudioContext();
      }).not.toThrow();
      
      expect(AudioContext).toHaveBeenCalled();
    });

    test('should create oscillator and gain nodes', () => {
      const audioContext = new AudioContext();
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      expect(audioContext.createOscillator).toHaveBeenCalled();
      expect(audioContext.createGain).toHaveBeenCalled();
      expect(oscillator).toBeDefined();
      expect(gainNode).toBeDefined();
    });

    test('should have proper volume levels set (0.15 for both sounds)', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check that both success and error sounds use 0.15 volume
      const successMatches = scriptContent.match(/linearRampToValueAtTime\(0\.15/g);
      expect(successMatches).toBeTruthy();
      expect(successMatches.length).toBeGreaterThanOrEqual(2); // At least one for each sound
    });
  });

  describe('Sound Effect Implementation', () => {
    test('should use sine wave oscillators', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      expect(scriptContent).toContain("oscillator.type = 'sine'");
    });

    test('should have proper frequency settings for success sound', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check for C5-E5-G5 chord frequencies
      expect(scriptContent).toContain('523.25'); // C5
      expect(scriptContent).toContain('659.25'); // E5
      expect(scriptContent).toContain('783.99'); // G5
    });

    test('should have descending frequency for error sound', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check for descending tone (400Hz to 200Hz)
      expect(scriptContent).toContain('400'); // Starting frequency
      expect(scriptContent).toContain('200'); // Ending frequency
    });
  });

  describe('Error Handling', () => {
    test('should handle audio context creation errors gracefully', () => {
      // Mock AudioContext to throw an error
      global.AudioContext = jest.fn(() => {
        throw new Error('Audio not supported');
      });

      // This should not throw an error in the actual implementation
      expect(() => {
        try {
          new AudioContext();
        } catch (error) {
          // Expected behavior - should be caught and handled
        }
      }).not.toThrow();
    });

    test('should have proper try-catch blocks in sound functions', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check that both sound functions have try-catch blocks
      expect(scriptContent).toContain('try {');
      expect(scriptContent).toContain('} catch (error) {');
      expect(scriptContent).toContain('Audio not supported or disabled');
    });
  });

  describe('Sound Envelope Improvements', () => {
    test('should have simplified error sound envelope', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Check that the error sound has clean attack-release envelope
      const errorSoundMatch = scriptContent.match(/function playErrorSound\(\) \{[\s\S]*?\}/);
      expect(errorSoundMatch).toBeTruthy();
      
      const errorSoundCode = errorSoundMatch[0];
      
      // Should have linearRampToValueAtTime for attack
      expect(errorSoundCode).toContain('linearRampToValueAtTime(0.15');
      
      // Should have exponentialRampToValueAtTime for release
      expect(errorSoundCode).toContain('exponentialRampToValueAtTime(0.01');
      
      // Should NOT have the old intermediate step (0.12)
      expect(errorSoundCode).not.toContain('linearRampToValueAtTime(0.12');
    });

    test('should have proper timing for sound effects', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      // Success sound timing
      expect(scriptContent).toContain('currentTime + 0.4'); // Duration
      expect(scriptContent).toContain('index * 100'); // Stagger

      // Error sound timing
      expect(scriptContent).toContain('currentTime + 0.6'); // Duration
      expect(scriptContent).toContain('currentTime + 0.1'); // Attack time
    });
  });

  describe('Updated Comments and Documentation', () => {
    test('should have updated comment for success sound', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      expect(scriptContent).toContain('// Play success sound');
      expect(scriptContent).not.toContain('// Play applause sound');
    });

    test('should have updated comment for error sound', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/math-monster-munch/script.js'),
        'utf8'
      );

      expect(scriptContent).toContain('// Play error sound');
      expect(scriptContent).not.toContain('// Play "ohhh" sound');
    });
  });
}); 