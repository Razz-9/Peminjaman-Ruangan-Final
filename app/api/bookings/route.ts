import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        b.*,
        r.name as room_name
      FROM bookings b
      LEFT JOIN rooms r ON b.room_id = r.id
      ORDER BY b.created_at DESC
    `)

    const bookings = result.rows.map((row) => ({
      id: row.id,
      roomId: row.room_id,
      name: row.name,
      phone: row.phone,
      unitKerja: row.unit_kerja,
      // PERBAIKAN: Format tanggal secara eksplisit sebelum dikirim
      bookingDate: new Date(row.booking_date).toISOString().split('T')[0],
      startTime: row.start_time,
      endTime: row.end_time,
      status: row.status,
      notes: row.notes,
      rejectionReason: row.rejection_reason,
      createdAt: row.created_at,
      roomName: row.room_name,
    }))

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { roomId, name, phone, unitKerja, bookingDate, startTime, endTime, status = "pending" } = body

    // Check for time conflicts
    const conflictCheck = await pool.query(
      `
      SELECT id FROM bookings 
      WHERE room_id = $1 
        AND booking_date = $2 
        AND status IN ('approved', 'pending', 'active')
        AND (
          ($3 >= start_time AND $3 < end_time) OR
          ($4 > start_time AND $4 <= end_time) OR
          ($3 <= start_time AND $4 >= end_time)
        )
    `,
      [roomId, bookingDate, startTime, endTime],
    )

    if (conflictCheck.rows.length > 0) {
      return NextResponse.json(
        {
          error: "Time conflict detected",
          message: "The selected time slot is already booked",
        },
        { status: 409 },
      )
    }

    const result = await pool.query(
      `INSERT INTO bookings (room_id, name, phone, unit_kerja, booking_date, start_time, end_time, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [roomId, name, phone, unitKerja, bookingDate, startTime, endTime, status],
    )

    const booking = {
      id: result.rows[0].id,
      roomId: result.rows[0].room_id,
      name: result.rows[0].name,
      phone: result.rows[0].phone,
      unitKerja: result.rows[0].unit_kerja,
      // PERBAIKAN (Konsistensi): Format tanggal juga di sini
      bookingDate: new Date(result.rows[0].booking_date).toISOString().split('T')[0],
      startTime: result.rows[0].start_time,
      endTime: result.rows[0].end_time,
      status: result.rows[0].status,
      notes: result.rows[0].notes,
      rejectionReason: result.rows[0].rejection_reason,
      createdAt: result.rows[0].created_at,
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}