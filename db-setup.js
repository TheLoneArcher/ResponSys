const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:uXTDUDhR5YNar9dr@db.mhzrukomgfuvhglianpc.supabase.co:5432/postgres',
});

async function main() {
  await client.connect();
  console.log("Connected to Supabase Postgres.");

  try {
    // Drop existing tables avoiding errors
    await client.query(`
      DROP TABLE IF EXISTS resources CASCADE;
      DROP TABLE IF EXISTS notifications CASCADE;
      DROP TABLE IF EXISTS report_updates CASCADE;
      DROP TABLE IF EXISTS tasks CASCADE;
      DROP TABLE IF EXISTS need_reports CASCADE;
      DROP TABLE IF EXISTS volunteers CASCADE;
      DROP TABLE IF EXISTS profiles CASCADE;
      
      DROP TYPE IF EXISTS skill_type CASCADE;
      DROP TYPE IF EXISTS severity_type CASCADE;
      DROP TYPE IF EXISTS status_type CASCADE;
      DROP TYPE IF EXISTS notif_type CASCADE;
      DROP TYPE IF EXISTS resource_category CASCADE;
      DROP TYPE IF EXISTS role_type CASCADE;
    `);

    console.log("Dropped existing tables and types.");

    // Extensions
    await client.query(`CREATE EXTENSION IF NOT EXISTS postgis;`);

    // Types
    await client.query(`
      CREATE TYPE role_type AS ENUM ('admin', 'volunteer');
      CREATE TYPE skill_type AS ENUM ('medical', 'logistics', 'heavy_lifting', 'tech_support');
      CREATE TYPE severity_type AS ENUM ('critical', 'moderate', 'low');
      CREATE TYPE status_type AS ENUM ('pending', 'dispatched', 'in_progress', 'verified');
      CREATE TYPE notif_type AS ENUM ('assignment', 'status_change', 'new_report', 'system');
      CREATE TYPE resource_category AS ENUM ('medical_supply', 'vehicle', 'equipment', 'food', 'shelter');
    `);

    // create profiles (depends on auth.users if we have it, but here we just reference auth.users UUID)
    await client.query(`
      CREATE TABLE profiles (
        id UUID PRIMARY KEY, -- references auth.users
        full_name TEXT NOT NULL,
        role role_type NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        phone TEXT
      );
    `);

    console.log("Created profiles.");

    // create volunteers
    await client.query(`
      CREATE TABLE volunteers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        skills skill_type[] NOT NULL DEFAULT '{}',
        last_location GEOGRAPHY(POINT),
        location_updated_at TIMESTAMPTZ,
        is_available BOOLEAN DEFAULT true,
        phone TEXT,
        total_tasks_completed INTEGER DEFAULT 0,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log("Created volunteers.");

    // create need_reports
    await client.query(`
      CREATE TABLE need_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        severity severity_type NOT NULL,
        status status_type NOT NULL DEFAULT 'pending',
        required_skill skill_type,
        location GEOGRAPHY(POINT) NOT NULL,
        location_label TEXT NOT NULL,
        submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
        image_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log("Created need_reports.");

    // create tasks
    await client.query(`
      CREATE TABLE tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        report_id UUID REFERENCES need_reports(id) ON DELETE CASCADE UNIQUE,
        volunteer_id UUID REFERENCES volunteers(id) ON DELETE CASCADE,
        assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
        status status_type NOT NULL DEFAULT 'pending',
        notes TEXT,
        completion_note TEXT,
        assigned_at TIMESTAMPTZ DEFAULT NOW(),
        resolved_at TIMESTAMPTZ
      );
    `);

    console.log("Created tasks.");

    // create report_updates
    await client.query(`
      CREATE TABLE report_updates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        report_id UUID REFERENCES need_reports(id) ON DELETE CASCADE,
        author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log("Created report_updates.");

    // create notifications
    await client.query(`
      CREATE TABLE notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type notif_type NOT NULL,
        is_read BOOLEAN DEFAULT false,
        related_report_id UUID REFERENCES need_reports(id) ON DELETE CASCADE,
        related_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log("Created notifications.");

    // create resources
    await client.query(`
      CREATE TABLE resources (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        category resource_category NOT NULL,
        quantity_available INTEGER NOT NULL,
        quantity_total INTEGER NOT NULL,
        location_label TEXT NOT NULL,
        managed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log("Created resources.");

    // Add row level security (RLS) to tables, but enable full access for everyone right now
    const tables = ['profiles', 'volunteers', 'need_reports', 'tasks', 'report_updates', 'notifications', 'resources'];
    for (const table of tables) {
      await client.query(`
        ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Enable all operations for all users" ON ${table};
        CREATE POLICY "Enable all operations for all users" ON ${table} FOR ALL USING (true) WITH CHECK (true);
      `);
    }
    console.log("Enabled RLS and created open policies.");
    
    // Create an update timestamp function and triggers
    await client.query(`
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_volunteers_updated_at ON volunteers;
      CREATE TRIGGER update_volunteers_updated_at
      BEFORE UPDATE ON volunteers
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
      
      DROP TRIGGER IF EXISTS update_need_reports_updated_at ON need_reports;
      CREATE TRIGGER update_need_reports_updated_at
      BEFORE UPDATE ON need_reports
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();

      DROP TRIGGER IF EXISTS update_resources_updated_at ON resources;
      CREATE TRIGGER update_resources_updated_at
      BEFORE UPDATE ON resources
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    `);
    
    console.log("Setup triggers for updated_at.");

  } catch (err) {
    console.error("Error setting up DB:", err);
  } finally {
    await client.end();
  }
}

main();
