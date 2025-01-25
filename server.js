const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('.'));

// Hardcoded users
const USERS = {
    'me': {
        username: 'me',
        password: 'me',
        gamesPlayed: 0,
        wins: 0,
        isAdmin: false
    },
    'BiteLaiX': {
        username: 'BiteLaiX',
        password: '0557813079',
        gamesPlayed: 0,
        wins: 0,
        isAdmin: true
    }
};

// Slot machine configuration
let SLOT_CONFIG = {
    winChance: 30, // Default 30% win chance
    lastUpdated: new Date().toISOString()
};

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Basic validation
    if (!username || !password) {
        return res.json({ success: false, message: 'Username and password are required' });
    }
    
    const user = USERS[username];
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
        return res.json({ success: false, message: 'Invalid credentials' });
    }
    
    res.json({ 
        success: true, 
        user: { 
            username: user.username, 
            gamesPlayed: user.gamesPlayed, 
            wins: user.wins,
            isAdmin: user.isAdmin
        } 
    });
});

// Update slot machine configuration
app.post('/admin/updateSlotChance', (req, res) => {
    const { adminUsername, winChance } = req.body;
    
    if (adminUsername !== 'BiteLaiX') {
        return res.json({ success: false, message: 'Unauthorized' });
    }
    
    // Validate win chance
    const chance = parseInt(winChance);
    if (isNaN(chance) || chance < 0 || chance > 100) {
        return res.json({ success: false, message: 'Invalid win chance value' });
    }
    
    SLOT_CONFIG.winChance = chance;
    SLOT_CONFIG.lastUpdated = new Date().toISOString();
    
    res.json({ success: true, config: SLOT_CONFIG });
});

// Get current slot configuration
app.get('/slot-config', (req, res) => {
    res.json(SLOT_CONFIG);
});

// Update user stats endpoint
app.post('/updateStats', (req, res) => {
    const { username, hasWon } = req.body;
    
    if (!username || !USERS[username]) {
        return res.json({ success: false, message: 'Invalid user' });
    }
    
    const user = USERS[username];
    user.gamesPlayed++;
    if (hasWon) user.wins++;
    
    res.json({ 
        success: true, 
        user: { 
            username: user.username, 
            gamesPlayed: user.gamesPlayed, 
            wins: user.wins 
        } 
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 