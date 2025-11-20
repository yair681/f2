// server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(express.json()); // לטיפול בבקשות JSON

// --- הגדרת קבצים סטטיים (Frontend) ---
app.use(express.static(path.join(__dirname, 'public')));

// --- ייבוא מודלים ו-Routes ---
const User = require('./src/models/User');
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/admin');
const { seedAdmin } = require('./src/utils/seeder'); // ייבוא פונקציית יצירת המנהל המוגן

// --- חיבור ל-MongoDB והפעלת השרת ---
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB successfully!');
        
        // יצירת מנהל המערכת המוגן אם הוא לא קיים
        seedAdmin(); 
        
        // --- שימוש בניתובים ---
        app.use('/api/auth', authRoutes); // ניתובים לכניסה/יציאה
        app.use('/api/admin', adminRoutes); // ניתובים לניהול (רק למנהל)

        // הפעלת השרת
        app.listen(PORT, () => {
            console.log(`🚀 Server listening on port ${PORT}`);
            console.log(`Open http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('❌ DB Connection error:', err.message));
