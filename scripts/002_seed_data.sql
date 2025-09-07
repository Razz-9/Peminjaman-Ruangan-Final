-- Insert default admin user (password: password)
INSERT INTO admins (username, password_hash, name) VALUES 
('admin', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQ', 'Administrator')
ON CONFLICT (username) DO NOTHING;

-- Insert sample rooms
INSERT INTO rooms (id, name, capacity, floor, amenities, description, image) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Lambelu Lt.1 TI',
    '10 orang',
    'Lantai 1',
    ARRAY['TV', 'Proyektor', 'Meja'],
    'Ruangan meeting dengan fasilitas lengkap untuk keperluan TI dan presentasi.',
    '/placeholder.svg?height=200&width=300'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Leuser Lt.1 Pengamanan',
    '10 orang',
    'Lantai 1',
    ARRAY['TV', 'Proyektor', 'Meja', 'AC'],
    'Ruangan meeting untuk keperluan pengamanan dengan fasilitas AC dan multimedia.',
    '/placeholder.svg?height=200&width=300'
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'Awu Lt.3',
    '10 orang',
    'Lantai 3',
    ARRAY['TV', 'Proyektor', 'Meja', 'AC'],
    'Ruangan meeting di lantai 3 dengan pemandangan yang baik dan fasilitas lengkap.',
    '/placeholder.svg?height=200&width=300'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (room_id, name, phone, unit_kerja, booking_date, start_time, end_time, status) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Jane Cooper',
    '081234567890',
    'TI',
    '2025-01-15',
    '10:00',
    '12:00',
    'approved'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Floyd Miles',
    '081234567891',
    'Umum',
    '2025-01-18',
    '14:00',
    '16:00',
    'pending'
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'Ronald Richards',
    '081234567892',
    'SDM',
    '2025-01-19',
    '10:00',
    '12:30',
    'rejected',
    'Ruangan sedang dalam perbaikan pada tanggal tersebut'
)
ON CONFLICT DO NOTHING;
