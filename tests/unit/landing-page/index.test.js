/**
 * @jest-environment jsdom
 */

const { screen, waitFor } = require('@testing-library/dom');
require('@testing-library/jest-dom');
const fs = require('fs');
const path = require('path');

// Load the HTML file
beforeEach(() => {
  document.body.innerHTML = fs.readFileSync(
    path.resolve(__dirname, '../../../index.html'),
    'utf8'
  );
  
  // Mock the main.js script to avoid running it directly
  // We'll test the functionality separately
  const scriptEl = document.querySelector('script[src="main.js"]');
  if (scriptEl) scriptEl.remove();
  
  // Mock image loading
  Object.defineProperty(global.Image.prototype, 'src', {
    set() {
      setTimeout(() => this.onload(), 100);
    }
  });
});

describe('Landing Page', () => {
  test('should render the page title', () => {
    expect(document.title).toBe('Game Collection');
  });
  test('should display the header', () => {
    const header = screen.getByRole('heading', { name: 'Game Collection', level: 1 });
    expect(header).toBeInTheDocument();
  });

  test('should display the games collection section', () => {
    const section = document.querySelector('.game-collection');
    expect(section).toBeInTheDocument();
  });

  test('should display the Memory Card game card', () => {    const gameTitle = screen.getByText('Memory Card Game');
    expect(gameTitle).toBeInTheDocument();
    
    const playButtons = screen.getAllByText('Play Now');
    const memoryCardPlayButton = playButtons.find(button => 
      button.getAttribute('href') === 'games/memory-card/index.html'
    );
    expect(memoryCardPlayButton).toHaveAttribute('href', 'games/memory-card/index.html');
  });

  test('should display the Counting Farm game card', () => {    const gameTitle = screen.getByText('Counting Farm');
    expect(gameTitle).toBeInTheDocument();
    
    const playButtons = screen.getAllByText('Play Now');
    const countingFarmPlayButton = playButtons.find(button => 
      button.getAttribute('href') === 'games/counting-farm/index.html'
    );
    expect(countingFarmPlayButton).toHaveAttribute('href', 'games/counting-farm/index.html');
  });

  test('should display the coming soon game cards', () => {
    const comingSoonElements = document.querySelectorAll('.coming-soon');
    expect(comingSoonElements.length).toBeGreaterThan(0);
    
    const disabledButtons = document.querySelectorAll('.play-button.disabled');
    expect(disabledButtons.length).toBeGreaterThan(0);
  });

  test('should display the footer', () => {
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(footer.textContent).toContain('Game Collection');
  });
});
