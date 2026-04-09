-- Initial Data Dump for testing
INSERT INTO users (id, name, email, phone, aadhar_card, city, role, firebase_uid) VALUES
('11111111-1111-1111-1111-111111111111', 'Rajesh Kumar', 'farmer@test.com', '9876543210', '123412341234', 'Pune', 'farmer', '$2b$10$X8aR8Hj8s.v2vMwW8yN4l.pW2Svwc8lW2W2W2W2W2W2W2W2W2W2W2') -- Use generic hash
ON CONFLICT DO NOTHING;

INSERT INTO users (id, name, email, phone, aadhar_card, city, role, firebase_uid) VALUES
('22222222-2222-2222-2222-222222222222', 'Amit Singh', 'buyer@test.com', '9876543211', '123412341235', 'Mumbai', 'buyer', '$2b$10$X8aR8Hj8s.v2vMwW8yN4l.pW2Svwc8lW2W2W2W2W2W2W2W2W2W2W2')
ON CONFLICT DO NOTHING;

INSERT INTO products (farmer_id, title, description, category, price, quantity, unit, location, images) VALUES
('11111111-1111-1111-1111-111111111111', 'Organic Wheat', 'Freshly harvested organic wheat.', 'Grains', 30.50, 1000, 'kg', 'Pune, Maharashtra', ARRAY['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=60']),
('11111111-1111-1111-1111-111111111111', 'Fresh Tomatoes', 'Red juicy tomatoes directly from the farm.', 'Vegetables', 40.00, 500, 'kg', 'Pune, Maharashtra', ARRAY['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=60']);
