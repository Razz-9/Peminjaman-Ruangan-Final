import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, rejectionReason } = body
    const { id } = params

    const result = await pool.query(
      `UPDATE bookings 
       SET status = $1, rejection_reason = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, rejectionReason || null, id],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const booking = {
      id: result.rows[0].id,
      roomId: result.rows[0].room_id,
      name: result.rows[0].name,
      phone: result.rows[0].phone,
      unitKerja: result.rows[0].unit_kerja,
      bookingDate: result.rows[0].booking_date,
      startTime: result.rows[0].start_time,
      endTime: result.rows[0].end_time,
      status: result.rows[0].status,
      notes: result.rows[0].notes,
      rejectionReason: result.rows[0].rejection_reason,
      createdAt: result.rows[0].created_at,
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}
