const mongoose = require('mongoose');
const Admin = require('../src/models/admin.model');
const bcrypt = require('bcrypt');

require('dotenv').config();
require('../src/config/db').connectDB();

async function seedAdmin() {
    const existing = await Admin.findOne({ email: 'admin@example.com' });
    if (!existing) {
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        const admin = new Admin({
            name: 'Default Admin',
            email: 'admin@example.com',
            password: hashedPassword
        });
        await admin.save();
        console.log('Admin seeded');
    } else {
        console.log('Admin already exists');
    }
    mongoose.disconnect();
}

seedAdmin();
