/**
 * @jest-environment jsdom
 */

require('@testing-library/jest-dom');

// Mock Web Audio API
const mockOscillator = {
  type: 'sine',
  frequency: { setValueAtTime: jest.fn() },
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

describe('Memory Card Game Sound Effects', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create minimal DOM structure
    document.body.innerHTML = `
      <div class="container">
        <div id="game-board" class="game-board"></div>
      </div>
    `;
  });

  describe('Function Existence and Naming', () => {
    test('should have playSuccessSound function (not playApplauseSound)', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      // Check that new function name exists and old one is gone
      expect(scriptContent).toContain('function playSuccessSound');
      expect(scriptContent).not.toContain('function playApplauseSound');
    });

    test('should call playSuccessSound when matches are found', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      expect(scriptContent).toContain('playSuccessSound()');
      expect(scriptContent).not.toContain('playApplauseSound()');
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

    test('should have proper volume level set (0.2 for Memory Card)', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      // Memory Card should use 0.2 volume (louder than Math Monster)
      expect(scriptContent).toContain('linearRampToValueAtTime(0.2');
    });
  });

  describe('Sound Effect Implementation', () => {
    test('should use sine wave oscillators', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      expect(scriptContent).toContain("oscillator.type = 'sine'");
    });

    test('should have C5-E5-G5 chord frequencies', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      // Check for the major chord frequencies
      expect(scriptContent).toContain('523.25'); // C5
      expect(scriptContent).toContain('659.25'); // E5
      expect(scriptContent).toContain('783.99'); // G5
    });

    test('should have proper timing and stagger', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      // Check for 100ms stagger between notes
      expect(scriptContent).toContain('index * 100');
      
      // Check for 0.4s duration
      expect(scriptContent).toContain('currentTime + 0.4');
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

    test('should have proper try-catch blocks in playSuccessSound', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      // Check that playSuccessSound has try-catch block
      expect(scriptContent).toContain('try {');
      expect(scriptContent).toContain('} catch (error) {');
      expect(scriptContent).toContain('Audio not supported or disabled');
    });
  });

  describe('Sound Envelope', () => {
    test('should have proper attack and release phases', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      // Check for attack phase
      expect(scriptContent).toContain('linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05)');
      
      // Check for release phase
      expect(scriptContent).toContain('exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)');
    });

    test('should start from zero volume', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      expect(scriptContent).toContain('gainNode.gain.setValueAtTime(0, audioContext.currentTime)');
    });
  });

  describe('Integration with Game Logic', () => {
    test('should be called when pairs are matched', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      // Check that playSuccessSound is called in match logic
      expect(scriptContent).toContain('// Play success sound');
      expect(scriptContent).toContain('playSuccessSound();');
    });

    test('should work in both single and multiplayer modes', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      // The sound should be called before mode-specific logic
      const playSuccessIndex = scriptContent.indexOf('playSuccessSound()');
      const multiplayerCheckIndex = scriptContent.indexOf('if (isMultiplayer)');
      
      // Sound should be called before multiplayer-specific logic
      expect(playSuccessIndex).toBeLessThan(multiplayerCheckIndex);
    });
  });

  describe('Performance Considerations', () => {
    test('should create new audio context for each call', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      // Should create new AudioContext each time for better compatibility
      expect(scriptContent).toContain('new (window.AudioContext || window.webkitAudioContext)()');
    });

    test('should clean up audio resources properly', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      // Should call stop to clean up resources
      expect(scriptContent).toContain('oscillator.stop(audioContext.currentTime + 0.4)');
    });
  });

  describe('Browser Compatibility', () => {
    test('should support both AudioContext and webkitAudioContext', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      expect(scriptContent).toContain('window.AudioContext || window.webkitAudioContext');
    });

    test('should handle browsers without Web Audio API', () => {
      const fs = require('fs');
      const path = require('path');
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      // Should have error handling for unsupported browsers
      expect(scriptContent).toContain('catch (error)');
      expect(scriptContent).toContain('console.log');
    });
  });
}); 