// scripts/create-database.js (Versi Perbaikan Final)

const { Client } = require("pg");

async function createDatabase() {
  // Gunakan user 'pelni_user' yang dibuat oleh Docker
  const client = new Client({
    host: "localhost",
    port: 5434, // Port yang benar
    user: "pelni_user", // User yang benar
    password: "Pelni2025", // Password dari docker-compose.yml
    database: "postgres", // Hubungkan ke database default untuk membuat yang baru
  });

  try {
    console.log("🔗 Connecting to PostgreSQL server...");
    await client.connect();
    console.log("✅ Connected successfully!");

    // Cek apakah database sudah ada
    const dbExists = await client.query("SELECT 1 FROM pg_database WHERE datname = 'pelni_booking'");

    if (dbExists.rows.length === 0) {
      console.log("📦 Creating database 'pelni_booking'...");
      await client.query("CREATE DATABASE pelni_booking");
      console.log("✅ Database 'pelni_booking' created.");
    } else {
      console.log("ℹ️  Database 'pelni_booking' already exists.");
    }

    // Grant privileges
    console.log("🔐 Granting privileges to pelni_user...");
    await client.query("GRANT ALL PRIVILEGES ON DATABASE pelni_booking TO pelni_user");
    console.log("✅ Privileges granted.");

    console.log("\n🎉 Database creation/check completed!");
    console.log("🚀 Next step: node scripts/setup-database.js");

  } catch (error) {
    console.error("❌ Error during database creation:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.log("\n🔧 Connection refused. Is the PostgreSQL Docker container running?");
      console.log("   Try running: docker-compose up -d");
    } else if (error.code === "28P01") {
        console.log("\n🔧 Authentication failed for 'pelni_user'. Please check POSTGRES_USER and POSTGRES_PASSWORD in your docker-compose.yml");
    }
  } finally {
    await client.end();
  }
}

createDatabase();