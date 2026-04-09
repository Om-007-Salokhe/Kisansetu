CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  aadhar_card VARCHAR(20) UNIQUE,
  city VARCHAR(255),
  role VARCHAR(50) DEFAULT 'buyer', -- 'farmer', 'buyer', 'admin'
  firebase_uid VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL, -- e.g., 'kg', 'ton', 'quintal'
  images TEXT[], -- array of image URLs
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL, -- 'seeds', 'fertilizers', 'labor', 'irrigation', 'other'
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  payment_method VARCHAR(50), -- 'upi', 'cod', 'card'
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity DECIMAL(10, 2) NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  farmer_id UUID REFERENCES users(id)
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(50), -- 'debit', 'credit'
  status VARCHAR(50), -- 'success', 'failed'
  gateway_transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
