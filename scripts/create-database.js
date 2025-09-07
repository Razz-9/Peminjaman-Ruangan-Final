const { Client } = require("pg")

async function createDatabase() {
  // Connect to postgres database first to create our database
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "pelni_user",
    password: "Pelni2025",
    database: "postgres", // Connect to default postgres database first
  })

  try {
    console.log("🔗 Connecting to PostgreSQL server...")
    await client.connect()
    console.log("✅ Connected to PostgreSQL server")

    // Check if database exists
    console.log("🔍 Checking if database exists...")
    const dbExists = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", ["pelni_booking"])

    if (dbExists.rows.length === 0) {
      console.log("📦 Creating database...")
      await client.query("CREATE DATABASE pelni_booking")
      console.log('✅ Database "pelni_booking" created successfully')
    } else {
      console.log('ℹ️  Database "pelni_booking" already exists')
    }

    // Check if user exists
    console.log("👤 Checking user...")
    const userExists = await client.query("SELECT 1 FROM pg_roles WHERE rolname = $1", ["pelni_user"])

    if (userExists.rows.length === 0) {
      console.log("👤 Creating user...")
      await client.query("CREATE USER pelni_user WITH PASSWORD 'Pelni2025'")
      console.log('✅ User "pelni_user" created')
    } else {
      console.log('ℹ️  User "pelni_user" already exists')
    }

    // Grant privileges
    console.log("🔐 Granting privileges...")
    await client.query("GRANT ALL PRIVILEGES ON DATABASE pelni_booking TO pelni_user")
    console.log("✅ Privileges granted to pelni_user")

    console.log("")
    console.log("🎉 Database creation completed!")
    console.log("")
    console.log("📝 Database Details:")
    console.log("   Host: localhost")
    console.log("   Port: 5432")
    console.log("   Database: pelni_booking")
    console.log("   User: pelni_user")
    console.log("   Password: Pelni2025")
    console.log("")
    console.log("🚀 Next step: node scripts/setup-database.js")
  } catch (error) {
    console.error("❌ Error creating database:", error.message)

    if (error.code === "ECONNREFUSED") {
      console.log("")
      console.log("🔧 Connection refused - PostgreSQL is not running")
      console.log("Start PostgreSQL first:")
      console.log("1. Using Docker: docker-compose up -d")
      console.log("2. Using local install: sudo service postgresql start")
    } else if (error.code === "28P01") {
      console.log("")
      console.log("🔧 Authentication failed")
      console.log("Make sure PostgreSQL is configured to accept connections")
      console.log("You might need to create the user first as superuser")
    }

    throw error
  } finally {
    await client.end()
  }
}

// Run if this file is executed directly
if (require.main === module) {
  createDatabase()
}

module.exports = { createDatabase }
