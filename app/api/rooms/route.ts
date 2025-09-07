import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM rooms WHERE is_active = true ORDER BY created_at DESC")

    const rooms = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      capacity: row.capacity,
      floor: row.floor,
      amenities: row.amenities || [],
      description: row.description,
      image: row.image,
      isActive: row.is_active,
    }))

    return NextResponse.json(rooms)
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, capacity, floor, amenities, description, image } = body

    const result = await pool.query(
      `INSERT INTO rooms (name, capacity, floor, amenities, description, image) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, capacity, floor, amenities, description, image],
    )

    const room = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      capacity: result.rows[0].capacity,
      floor: result.rows[0].floor,
      amenities: result.rows[0].amenities || [],
      description: result.rows[0].description,
      image: result.rows[0].image,
      isActive: result.rows[0].is_active,
    }

    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}
