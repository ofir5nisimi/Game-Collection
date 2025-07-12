document.addEventListener('DOMContentLoaded', () => {
    console.log('Script starting...');
    
    // Test DOM element access with error handling
    function testElementAccess() {
        const elements = [
            'start-btn',
            'next-btn', 
            'game-mode',
            'starting-level',
            'level-config-btn',
            'level-config-modal',
            'save-config-btn',
            'reset-config-btn',
            'close-config-btn'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            console.log(`${id}:`, element ? '✅ Found' : '❌ Missing');
            if (!element) {
                console.error(`Missing element: ${id}`);
            }
        });
    }
    
    // Safe initialization
    function safeInit() {
        try {
            console.log('Starting safe initialization...');
            testElementAccess();
            
            // Test basic DOM elements first
            const startBtn = document.getElementById('start-btn');
            const startingLevelSelect = document.getElementById('starting-level');
            
            if (!startBtn) {
                throw new Error('start-btn element not found');
            }
            
            if (!startingLevelSelect) {
                throw new Error('starting-level element not found');
            }
            
            console.log('✅ Basic elements found, continuing with initialization...');
            
            // Only proceed if elements exist
            if (startingLevelSelect) {
                const options = startingLevelSelect.querySelectorAll('option');
                console.log('Level select options found:', options.length);
            }
            
            console.log('✅ Safe initialization completed');
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            // Show error to user
            document.body.innerHTML += `
                <div style="position:fixed;top:10px;right:10px;background:red;color:white;padding:10px;border-radius:5px;z-index:9999;">
                    Error: ${error.message}
                </div>
            `;
        }
    }
    
    // Run safe initialization
    safeInit();
    
    console.log('Script loaded successfully');
}); 