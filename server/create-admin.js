import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './src/models/User.js';

dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@slay.com' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('Role:', existingAdmin.role);

            // Update to admin if not already
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('✅ Updated existing user to admin role');
            }
        } else {
            // Create new admin user
            const hashedPassword = await bcrypt.hash('admin123', 10);

            const adminUser = await User.create({
                name: 'Admin',
                email: 'admin@slay.com',
                password: hashedPassword,
                role: 'admin',
                phone: '1234567890'
            });

            console.log('✅ Admin user created successfully!');
            console.log('📧 Email: admin@slay.com');
            console.log('🔑 Password: admin123');
            console.log('⚠️  Please change the password after first login!');
        }

        await mongoose.connection.close();
        console.log('✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser();
