// ============================================================
// YAS Help Desk - Admin User Seeding Script
// Run this script to create the first admin user in your database
// ============================================================

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('Please set these in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAdminUser() {
  try {
    console.log('🌱 Starting admin user seeding...\n');

    // Admin user configuration
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@yas-helpdesk.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@2026';
    const adminName = process.env.ADMIN_NAME || 'YAS Admin';

    console.log('📋 Admin User Configuration:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Name: ${adminName}`);
    console.log(`   Password: ${'*'.repeat(adminPassword.length)}\n`);

    // Check if admin user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (existingUser) {
      console.log('⚠️  Admin user already exists with email:', adminEmail);
      console.log('   Skipping creation.\n');
      return;
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    console.log('👤 Creating admin user...');
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: adminEmail,
        name: adminName,
        password_hash: passwordHash,
        role: 'admin',
        is_active: true,
        phone: ''
      })
      .select('id, email, name, role, is_active')
      .single();

    if (insertError) {
      console.error('❌ Failed to create admin user:', insertError);
      process.exit(1);
    }

    console.log('✅ Admin user created successfully!\n');
    console.log('📝 User Details:');
    console.log(`   ID: ${newUser.id}`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Name: ${newUser.name}`);
    console.log(`   Role: ${newUser.role}`);
    console.log(`   Active: ${newUser.is_active}\n`);

    console.log('🎉 Setup complete! You can now login with:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}\n`);
    console.log('⚠️  IMPORTANT: Change the password after first login!\n');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding
seedAdminUser()
  .then(() => {
    console.log('✨ Seeding completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
