import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, capacity, floor, amenities, description, image } = body
    const { id } = params

    const result = await pool.query(
      `UPDATE rooms 
       SET name = $1, capacity = $2, floor = $3, amenities = $4, description = $5, image = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND is_active = true
       RETURNING *`,
      [name, capacity, floor, amenities, description, image, id],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

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

    return NextResponse.json(room)
  } catch (error) {
    console.error("Error updating room:", error)
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await pool.query(
      "UPDATE rooms SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Room deleted successfully" })
  } catch (error) {
    console.error("Error deleting room:", error)
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}
