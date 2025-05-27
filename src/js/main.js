import { Game } from './game/Game.js';

// Initialize game when DOM is loaded
function initializeGame() {
    console.log('🎮 Initializing Turn-Based Battle Arena...');

    // Test if basic DOM elements exist
    const characterSelection = document.getElementById('character-selection');
    const player1Setup = document.getElementById('player1-setup');
    const player2Setup = document.getElementById('player2-setup');

    console.log('DOM Elements Check:', {
        characterSelection: !!characterSelection,
        player1Setup: !!player1Setup,
        player2Setup: !!player2Setup
    });

    // Test basic click functionality
    if (player1Setup) {
        const cards = player1Setup.querySelectorAll('.character-card');
        console.log(`Found ${cards.length} character cards in player1Setup`);
        cards.forEach((card, index) => {
            console.log(`Card ${index}:`, card.dataset.class);
            // Add a simple test click handler
            card.addEventListener('click', () => {
                console.log(`🎯 TEST CLICK: Card ${index} (${card.dataset.class}) clicked!`);
                card.style.border = '3px solid red';
            });
        });
    }

    if (player2Setup) {
        const cards = player2Setup.querySelectorAll('.character-card');
        console.log(`Found ${cards.length} character cards in player2Setup`);
        cards.forEach((card, index) => {
            console.log(`Card ${index}:`, card.dataset.class);
            // Add a simple test click handler
            card.addEventListener('click', () => {
                console.log(`🎯 TEST CLICK: P2 Card ${index} (${card.dataset.class}) clicked!`);
                card.style.border = '3px solid blue';
            });
        });
    }

    try {
        const game = new Game();

        // Handle window resize
        window.addEventListener('resize', () => {
            game.handleResize();
        });

        // Make game globally accessible for debugging
        window.game = game;

        console.log('✅ Game initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing game:', error);
    }
}

// Check if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    // DOM is already loaded
    initializeGame();
}
