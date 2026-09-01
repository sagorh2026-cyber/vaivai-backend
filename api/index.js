const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Supabase Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:ShamimA1998@@db.nwtbnmscffahmbwwatmn.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Vai Vai Enterprise Backend is Live on Vercel!');
});

// ১. শপ তালিকা
app.get('/api/shops', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM shops ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ২. শপ যোগ করা
app.post('/api/shops', async (req, res) => {
  const { shop_name, owner_name, phone, address, route } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO shops (shop_name, owner_name, phone, address, route) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [shop_name, owner_name, phone, address, route]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ৩. প্রোডাক্ট তালিকা
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ৪. অর্ডার সাবমিট
app.post('/api/orders', async (req, res) => {
  const { sr_id, shop_id, total_amount } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO orders (sr_id, shop_id, total_amount) VALUES ($1, $2, $3) RETURNING *',
      [sr_id, shop_id, total_amount]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ৫. লোকেশন সেভ
app.post('/api/location', async (req, res) => {
  const { sr_id, latitude, longitude } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO location_pings (sr_id, latitude, longitude) VALUES ($1, $2, $3) RETURNING *',
      [sr_id, latitude, longitude]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
