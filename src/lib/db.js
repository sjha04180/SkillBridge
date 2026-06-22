import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/User';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function seedAdmin() {
  try {
    const adminEmail = 'admin@skillbridge.edu';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('adminpassword123', 10);
      await User.create({
        name: 'System Administrator',
        email: adminEmail,
        password: hashedPassword,
        college: 'SkillBridge HQ',
        branch: 'Administration',
        graduationYear: 2026,
        role: 'admin',
      });
      console.log('Seeded default admin user successfully.');
    }
  } catch (err) {
    console.error('Failed to seed default admin:', err);
  }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    // Run seeding
    await seedAdmin();
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
